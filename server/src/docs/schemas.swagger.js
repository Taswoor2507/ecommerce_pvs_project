/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: The user ID
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email
 *         role:
 *           type: string
 *           enum: [user, admin]
 *           description: User role
 *
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - base_price
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         base_price:
 *           type: number
 *         stock:
 *           type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         variant_types:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/VariantType'
 *
 *     VariantType:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
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
 *         value:
 *           type: string
 *
 *     Combination:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         product_id:
 *           type: string
 *         options:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of Option IDs
 *         options_hash:
 *           type: string
 *           description: Unique pipe-delimited string of sorted option IDs
 *         stock:
 *           type: number
 *         additional_price:
 *           type: number
 *         final_price:
 *           type: number
 *           description: Computed field (Base Price + Additional Price)
 *         in_stock:
 *           type: boolean
 *         option_labels:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *               value:
 *                 type: string
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user_id:
 *           $ref: '#/components/schemas/User'
 *         product_id:
 *           type: string
 *         combination_id:
 *           type: string
 *         total_price:
 *           type: number
 *         status:
 *           type: string
 *           enum: [pending, confirmed, shipped, delivered, cancelled]
 *         createdAt:
 *           type: string
 *           format: date-time
 */
