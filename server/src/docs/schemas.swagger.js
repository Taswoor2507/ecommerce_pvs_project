/**
 * @swagger
 * components:
 *   schemas:
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Something went wrong
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 64b1f2c3d4e5f6789abcde01
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           example: user
 *
 *     Product:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64b1f2c3d4e5f6789abcde01
 *         name:
 *           type: string
 *           example: Classic T-Shirt
 *         description:
 *           type: string
 *           example: A comfortable everyday t-shirt
 *         base_price:
 *           type: number
 *           example: 29.99
 *         stock:
 *           type: number
 *           example: 100
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         variant_types:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VariantType'
 *
 *     CreateProductInput:
 *       type: object
 *       required:
 *         - name
 *         - base_price
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           example: Classic T-Shirt
 *         description:
 *           type: string
 *           maxLength: 2000
 *           example: A comfortable everyday t-shirt
 *         base_price:
 *           type: number
 *           minimum: 0
 *           example: 29.99
 *         stock:
 *           type: number
 *           minimum: 0
 *           default: 0
 *           example: 100
 *
 *     UpdateProductInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           minLength: 1
 *           maxLength: 200
 *           example: Classic T-Shirt
 *         description:
 *           type: string
 *           maxLength: 2000
 *           example: Updated description
 *         base_price:
 *           type: number
 *           minimum: 0
 *           example: 34.99
 *         stock:
 *           type: number
 *           minimum: 0
 *           example: 50
 *
 *     VariantType:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64b1f2c3d4e5f6789abcde02
 *         name:
 *           type: string
 *           example: Color
 *         options:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VariantOption'
 *
 *     VariantOption:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64b1f2c3d4e5f6789abcde03
 *         value:
 *           type: string
 *           example: Red
 *
 *     Combination:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64b1f2c3d4e5f6789abcde04
 *         product_id:
 *           type: string
 *           example: 64b1f2c3d4e5f6789abcde01
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of Option IDs
 *           example: ["64b1f2c3d4e5f6789abcde03", "64b1f2c3d4e5f6789abcde05"]
 *         options_hash:
 *           type: string
 *           description: Unique pipe-delimited string of sorted option IDs
 *           example: 64b1f2c3d4e5f6789abcde03|64b1f2c3d4e5f6789abcde05
 *         stock:
 *           type: number
 *           example: 20
 *         additional_price:
 *           type: number
 *           example: 5.00
 *         final_price:
 *           type: number
 *           description: Computed — Base Price + Additional Price
 *           example: 34.99
 *         in_stock:
 *           type: boolean
 *           example: true
 *         option_labels:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: Color
 *               value:
 *                 type: string
 *                 example: Red
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 64b1f2c3d4e5f6789abcde10
 *         user_id:
 *           $ref: '#/components/schemas/User'
 *         combination_id:
 *           type: string
 *           example: 64b1f2c3d4e5f6789abcde04
 *         quantity:
 *           type: integer
 *           example: 2
 *         total_price:
 *           type: number
 *           example: 69.98
 *         status:
 *           type: string
 *           enum: [pending, confirmed, shipped, delivered, cancelled]
 *           example: pending
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2024-01-15T10:30:00Z
 */
