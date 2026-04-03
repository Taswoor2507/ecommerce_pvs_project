import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { createProductService } from "./product.service.js";

// create product controller
const createProduct  = asyncHandler(async(req,res)=>{
    const {name , description , base_price} = req.body;
    const product = await createProductService({name , description , base_price});
    res.status(201).json({
        success:true,
        message:"Product created successfully",
        data:product,
    })
})

export {createProduct};