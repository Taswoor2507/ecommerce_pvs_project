import { addOptionService, addVariantTypeService } from './variant.service.js';
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


const addOptionController = asyncHandler(async (req, res) => {
  const { id: productId, vid: variantTypeId } = req.params;
  const { option } = req.body;

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


export {addVariantType , addOptionController};