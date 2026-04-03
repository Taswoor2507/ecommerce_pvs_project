import { addVariantTypeService } from './variant.service.js';
import { asyncHandler } from '../../middlewares/asyncHandler.js'; 

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

export {addVariantType};