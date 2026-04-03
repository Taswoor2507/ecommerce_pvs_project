import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { createProductService , getProductService, listProductsService, updateProductService } from "./product.service.js";

// create product controller
const createProduct = asyncHandler(async (req, res) => {
    const { name, description, base_price } = req.body;
    const product = await createProductService({ name, description, base_price });
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product,
    })
})

// list product controller
const listProducts = asyncHandler(async (req, res) => {
    const products = await listProductsService(req.query);
    res.status(200).json({
        success: true,
        message: "Products listed successfully",
        data: products,
    })
})

// Get single product controller
const getProduct = asyncHandler(async (req, res) => {
  const productData = await getProductService(req.params.id);

  res.status(200).json({
    success: true,
    data: productData,
  });
});

// Update product controller
const updateProduct = asyncHandler(async (req, res) => {
  const updatedProduct = await updateProductService(req.params.id, req.body);

  // If no changes were made, return 200 with message
  if (updatedProduct.message) {
    return res.status(200).json({
      success: true,
      message: updatedProduct.message,
      data: {
        id: updatedProduct.id,
        name: updatedProduct.name,
        description: updatedProduct.description,
        base_price: updatedProduct.base_price,
        updatedAt: updatedProduct.updatedAt,
      },
    });
  }

  // Actual update occurred
  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

export { createProduct, listProducts, getProduct , updateProduct };