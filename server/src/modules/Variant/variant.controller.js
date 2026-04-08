import { addOptionService, addVariantTypeService, deleteOptionService, deleteVariantTypeService } from './variant.service.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js'; 


// add varianttype controller
 const addVariantType = asyncHandler(async (req, res) => {
  const { id: productId } = req.params;
  const { name, options } = req.body;


  const { variantType, options: variantOptions, combinationsGenerated } =
    await addVariantTypeService(productId, name, options);

  res.status(201).json({
    status: 'success',
    data: {
      variant_type: {
        id: variantType._id,
        name: variantType.name,
        options: variantOptions,
      },
      combinations_generated: combinationsGenerated,
      note: combinationsGenerated > 0
        ? 'New combinations have been created with stock=0 and additional_price=0.'
        : undefined,
    },
  });
});

// add option controler
const addOption = asyncHandler(async (req, res) => {
  const { id: productId, vid: variantTypeId } = req.params;
  
  
  const { option } = req.body;

  if (!option) {
    return res.status(400).json({
      success: false,
      errors: {
        general: "Body is empty or option is missing"
      }
    });
  }

  const { newOption, newCombinationsGenerated } =
    await addOptionService(productId, variantTypeId, option);

  res.status(201).json({
    success: true,
    data: {
      option: {
        _id: newOption._id,
        value: newOption.value,
      },
      new_combinations_generated: newCombinationsGenerated,
      note: "New combinations created with stock=0 and additional_price=0. Existing combinations are unchanged.",
    },
  });
});


//delete variant type controller 

const deleteVariantType = asyncHandler(async (req, res) => {
  const { id: productId, vid: variantTypeId } = req.params;

  const { name, deactivated, newCombinationsGenerated } =
    await deleteVariantTypeService(productId, variantTypeId);

  res.json({
    success: true,
    data: {
      name,
      message: `Variant type "${name}" removed`,
      combinations_deactivated: deactivated,
      new_combinations_generated: newCombinationsGenerated,
    },
  });
});


//delete option controller
const deleteOption = asyncHandler(async (req, res) => {
  const { oid: optionId } = req.params;

  const { value, deactivated } = await deleteOptionService(optionId);

  res.json({
    status: "success",
    data: {
      value,
      message: `Option "${value}" removed`,
      combinations_deactivated: deactivated,
    },
  });
});




export {addVariantType , addOption , deleteVariantType , deleteOption};