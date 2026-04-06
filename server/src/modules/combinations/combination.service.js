
import mongoose from 'mongoose';
import { VariantType, Combination , Option , Product } from "../../models/index.js"
import { ApiError } from '../../utils/apiError.js';


// ── Hash helpers ──────────────────────────────────────────────────────────────

/**
 * Given an array of Mongoose ObjectIds (or strings), produce the canonical
 * options_hash: sort all IDs as strings, then join with "|".
 *
 * WHY SORT: Guarantees identical hash regardless of the order the user
 * selected options (Size then Color vs Color then Size → same hash).
 */
function buildHash(optionIds) {
  return optionIds
    .map((id) => id.toString())
    .sort()
    .join('|');
}

/**
 * Build the option_labels snapshot array from variant types + options.
 * e.g. [{ type: "Size", value: "M" }, { type: "Color", value: "Blue" }]
 */
function buildOptionLabels(variantTypes, optionTuple) {
  return optionTuple.map((opt, idx) => ({
    type:  variantTypes[idx].name,
    value: opt.value,
  }));
}

// ── Cartesian product helper ──────────────────────────────────────────────────

/**
 * Pure function: compute the Cartesian product of an array-of-arrays.
 *
 * Example:
 *   cartesian([[S,M,L], [Red,Blue]])
 *   → [[S,Red], [S,Blue], [M,Red], [M,Blue], [L,Red], [L,Blue]]
 *
 * Algorithm: start with [[]] (one empty tuple), then for each group, expand
 * every existing partial tuple by appending each element in the group.
 */
function cartesian(groups) {
  return groups.reduce(
    (acc, group) =>
      acc.flatMap((partialTuple) =>
        group.map((item) => [...partialTuple, item])
      ),
    [[]]
  );
}

// ── Scenario A: Full regeneration ─────────────────────────────────────────────

/**
 * Regenerate ALL combinations for a product from scratch.
 * Called when a new variant type is added (changes the combination shape).
 *
 * Steps:
 *   1. Fetch all variant types + their options
 *   2. Compute Cartesian product of all option arrays
 *   3. For each tuple: build hash, upsert combination (preserves price/stock if exists)
 *   4. Soft-delete any combination NOT in the new hash set
 *   5. Return count of new + reactivated combinations
 *
 * Uses bulkWrite with $setOnInsert so admin-configured prices and stock on
 * existing combinations are NEVER overwritten.
 */
async function generateCombinationsForProduct(productId, session) {
  const variantTypes = await VariantType.find({ product_id: productId })
    .sort({ position: 1, createdAt: 1 })
    .lean()
    .session(session || null);

  // No variant types → no combinations
  if (variantTypes.length === 0) {
    await Combination.updateMany(
      { product_id: productId, is_active: true },
      { is_active: false },
      { session }
    );
    return 0;
  }

  // Fetch all options grouped by variant type
  const optionsByType = {};
  for (const vt of variantTypes) {
    const opts = await Option.find({ variant_type_id: vt._id })
      .sort({ position: 1, createdAt: 1 })
      .lean()
      .session(session || null);
    optionsByType[vt._id.toString()] = opts;
  }

  // Check: every variant type must have at least one option
  for (const vt of variantTypes) {
    if ((optionsByType[vt._id.toString()] || []).length === 0) {
      // Skip generation — variant type has no options yet
      return 0;
    }
  }

  // Build array-of-arrays: [[S,M,L], [Red,Blue]]
  const groups = variantTypes.map((vt) => optionsByType[vt._id.toString()]);

  // Compute Cartesian product
  const tuples = cartesian(groups);

  // Build upsert operations
  const newHashes = new Set();
  const bulkOps = tuples.map((optionTuple) => {
    const optionIds  = optionTuple.map((o) => o._id);
    const hash       = buildHash(optionIds);
    const labels     = buildOptionLabels(variantTypes, optionTuple);

    newHashes.add(hash);

    return {
      updateOne: {
        filter: { options_hash: hash },
        update: {
          // $setOnInsert: only runs on INSERT, not on UPDATE
          // → preserves existing price/stock on already-existing combinations
          $setOnInsert: {
            product_id:       new mongoose.Types.ObjectId(productId),
            additional_price: 0,
            stock:            0,
            option_labels:    labels,
          },
          // $set: always runs — ensures options array is always synchronized
          $set: { 
            is_active: true,
            options: optionIds, // Always update options to ensure sync
          },
        },
        upsert: true,
      },
    };
  });

  if (bulkOps.length > 0) {
    await Combination.bulkWrite(bulkOps, { session });
  }

  // Soft-delete combinations that are no longer valid (not in new hash set)
  // This handles combinations from a previously-different set of variant types
  const allActiveCombos = await Combination.find({
    product_id: productId,
    is_active:  true,
  })
    .select('options_hash')
    .lean()
    .session(session || null);

  const staleIds = allActiveCombos
    .filter((c) => !newHashes.has(c.options_hash))
    .map((c) => c._id);

  if (staleIds.length > 0) {
    await Combination.updateMany(
      { _id: { $in: staleIds } },
      { is_active: false },
      { session }
    );
  }

  return tuples.length;
}

// ── Scenario B: Partial generation (new option added) ─────────────────────────

/**
 * Generate ONLY the new combinations introduced by adding a single new option.
 * Existing combinations are completely untouched (price/stock preserved).
 *
 * Example:
 *   Product has [Size: S,M,L] × [Color: Red,Blue] → 6 combinations
 *   Admin adds "XL" to Size
 *   → Only [XL+Red] and [XL+Blue] are created (2 new)
 *   → Existing 6 combinations unchanged
 */
async function generateCombinationsForNewOption(
  productId,
  variantTypeId,
  newOptionId,
  session
) {
  // Fetch the new option
  const newOption = await Option.findById(newOptionId).lean().session(session || null);
  if (!newOption) return 0;

  // Fetch all OTHER variant types (not the one being modified)
  const otherVariantTypes = await VariantType.find({
    product_id: productId,
    _id:        { $ne: variantTypeId },
  })
    .sort({ position: 1, createdAt: 1 })
    .lean()
    .session(session || null);

  // Also need the current variant type for label building
  const currentVT = await VariantType.findById(variantTypeId).lean().session(session || null);

  let tuples; // Array of option-tuples to create combinations for

  if (otherVariantTypes.length === 0) {
    // This is the only variant type on the product → single combination per option
    tuples = [[newOption]];
  } else {
    // Fetch options for each other variant type
    const otherGroups = [];
    const orderedOtherVTs = [];

    for (const vt of otherVariantTypes) {
      const opts = await Option.find({ variant_type_id: vt._id })
        .sort({ position: 1, createdAt: 1 })
        .lean()
        .session(session || null);

      if (opts.length === 0) continue; // Skip empty variant types
      otherGroups.push(opts);
      orderedOtherVTs.push(vt);
    }

    if (otherGroups.length === 0) {
      tuples = [[newOption]];
    } else {
      // Cartesian product of other options, then append newOption to each tuple
      const otherTuples = cartesian(otherGroups);
      tuples = otherTuples.map((t) => [...t, newOption]);
      // We also need the variant types in the same order for label building
      // Reorder: match tuple order (other VTs + current VT at end)
    }
  }

  // Build upsert operations for each new tuple
  let created = 0;
  const bulkOps = [];

  for (const optionTuple of tuples) {
    const optionIds = optionTuple.map((o) => o._id);
    const hash      = buildHash(optionIds);

    // Build option_labels: we need to map each option back to its variant type name
    // Fetch variant type for each option in tuple
    const labels = await Promise.all(
      optionTuple.map(async (opt) => {
        const vt = await VariantType.findById(opt.variant_type_id)
          .lean()
          .session(session || null);
        return { type: vt ? vt.name : 'Unknown', value: opt.value };
      })
    );

    bulkOps.push({
      updateOne: {
        filter: { options_hash: hash },
        update: {
          $setOnInsert: {
            product_id:       new mongoose.Types.ObjectId(productId),
            additional_price: 0,
            stock:            0,
            option_labels:    labels,
          },
          $set: { 
            is_active: true,
            options: optionIds, // Always update options to ensure sync
          },
        },
        upsert: true,
      },
    });
    created++;
  }

  if (bulkOps.length > 0) {
    await Combination.bulkWrite(bulkOps, { session });
  }

  return created;
}

// ── Combination Lookup ─────────────────────────────────────────────────────────

/**
 * Look up the combination matching a user's selection.
 *
 * Request body example: { "Size": "M", "Color": "Blue" }
 *
 * Algorithm:
 *   1. Validate that selection covers ALL variant types for the product
 *   2. Resolve each selection to an option._id
 *   3. Build options_hash from sorted IDs
 *   4. Single indexed DB lookup
 *   5. Calculate final_price = base_price + additional_price
 */
async function lookupCombination(productId, selection) {
  // Use cache for product + variants (avoids 2 extra DB reads)
  const { getProductWithVariants } = require('../utils/cache');
  const productData = await getProductWithVariants(productId);

  if (!productData) {
    throw new ApiError(404, 'Product not found');
  }

  const { variant_types, base_price } = productData;

  // ── Validate completeness ──────────────────────────────────────────────────
  const selectionKeys    = Object.keys(selection);
  const variantTypeNames = variant_types.map((vt) => vt.name);

  // Check no extra keys
  for (const key of selectionKeys) {
    if (!variantTypeNames.includes(key)) {
      throw new ApiError(400, `Invalid variant type: "${key}"`);
    }
  }

  // Check all variant types are covered
  for (const vtName of variantTypeNames) {
    if (!selection[vtName]) {
      throw new ApiError(400, `Missing selection for variant type: "${vtName}"`);
    }
  }

  // ── Resolve option IDs ─────────────────────────────────────────────────────
  const resolvedOptionIds = [];

  for (const vt of variant_types) {
    const selectedValue = selection[vt.name];
    const matchedOption = vt.options.find(
      (o) => o.value.toLowerCase() === selectedValue.toLowerCase()
    );

    if (!matchedOption) {
      throw new ApiError(
        400,
        `Invalid option value "${selectedValue}" for variant type "${vt.name}"`
      );
    }

    resolvedOptionIds.push(matchedOption._id);
  }

  // ── Build hash and lookup ──────────────────────────────────────────────────
  const hash = buildHash(resolvedOptionIds);

  const combo = await Combination.findOne({
    product_id:   productId,
    options_hash: hash,
    is_active:    true,
  }).lean();

  if (!combo) {
    throw new ApiError(
      404,
      'No combination found for this selection. This may be a data inconsistency — please contact support.'
    );
  }

  // ── Calculate final price ──────────────────────────────────────────────────
  const final_price = parseFloat(
    (base_price + combo.additional_price).toFixed(2)
  );

  return {
    combination_id:   combo._id,
    additional_price: combo.additional_price,
    final_price,
    stock:            combo.stock,
    in_stock:         combo.stock > 0,
    option_labels:    combo.option_labels,
  };
}

/**
 * Validate and fix inconsistent combinations where options_hash doesn't match options array
 * This can happen due to the bug we just fixed
 */
async function validateAndFixCombinations(productId, session) {
  const inconsistentCombinations = await Combination.find({
    product_id: productId,
    is_active: true,
  }).session(session || null);

  let fixedCount = 0;
  const bulkOps = [];

  for (const combo of inconsistentCombinations) {
    const expectedHash = buildHash(combo.options);
    
    if (combo.options_hash !== expectedHash) {
      console.warn(`Found inconsistent combination: ${combo._id}`);
      console.warn(`  Expected hash: ${expectedHash}`);
      console.warn(`  Actual hash:   ${combo.options_hash}`);
      console.warn(`  Options:       ${combo.options.map(id => id.toString()).join(', ')}`);
      
      bulkOps.push({
        updateOne: {
          filter: { _id: combo._id },
          update: { $set: { options_hash: expectedHash } },
        },
      });
      fixedCount++;
    }
  }

  if (bulkOps.length > 0) {
    await Combination.bulkWrite(bulkOps, { session });
    console.log(`Fixed ${fixedCount} inconsistent combinations for product ${productId}`);
  }

  return fixedCount;
}




//  list all combinations for a product
async function listCombinationsService  (productId) {
  const product = await Product.findOne({ _id: productId, is_active: true }).lean();
  if (!product) throw new ApiError(404, "Product not found");

  const combinations = await Combination.find({
    product_id: productId,
    is_active: true,
  })
    .sort({ createdAt: 1 })
    .lean();

  // Compute final data
  const data = combinations.map((c) => ({
    _id: c._id,
    option_labels: c.option_labels,
    additional_price: c.additional_price,
    final_price: parseFloat((product.base_price + c.additional_price).toFixed(2)),
    stock: c.stock,
    in_stock: c.stock > 0,
  }));

  return { product_base_price: product.base_price, combinations: data };
};


// update  combination
async function updateCombinationService (comboId, payload) {
  const update = {};

  if (payload.additional_price !== undefined) {
    update.additional_price = payload.additional_price;
  }

  if (payload.stock !== undefined) {
    update.stock = Math.floor(payload.stock);
  }

  const combo = await Combination.findOneAndUpdate(
    { _id: comboId, is_active: true },
    update,
    { new: true, runValidators: true }
  );

  if (!combo) throw new ApiError(404, "Combination not found");

  // Fetch product base price
  const product = await Product.findById(combo.product_id)
    .select("base_price")
    .lean();

  const final_price = product
    ? parseFloat((product.base_price + combo.additional_price).toFixed(2))
    : null;

  return {
    _id: combo._id,
    option_labels: combo.option_labels,
    additional_price: combo.additional_price,
    final_price,
    stock: combo.stock,
    in_stock: combo.stock > 0,
  };
};





export {
  generateCombinationsForProduct,
  generateCombinationsForNewOption,
  lookupCombination,
  buildHash,
  validateAndFixCombinations,
  listCombinationsService,
  updateCombinationService,
  };