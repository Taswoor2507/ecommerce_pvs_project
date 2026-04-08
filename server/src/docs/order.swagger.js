/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order placement and management
 */

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Place a new order with multiple items (Authenticated users)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *               - shippingInfo
 *             properties:
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 description: Array of items to order
 *                 items:
 *                   $ref: '#/components/schemas/OrderItem'
 *                 example:
 *                   - productId: 64b1f2c3d4e5f6789abcde01
 *                     quantity: 2
 *                     price: 29.99
 *                     name: "Classic T-Shirt"
 *                     image: "https://example.com/image.jpg"
 *                     variants: []
 *                   - productId: 64b1f2c3d4e5f6789abcde02
 *                     combinationId: 64b1f2c3d4e5f6789abcde10
 *                     quantity: 1
 *                     price: 49.99
 *                     name: "Premium Hoodie"
 *                     image: "https://example.com/image2.jpg"
 *                     variants:
 *                       - type: "size"
 *                         value: "L"
 *                       - type: "color"
 *                         value: "blue"
 *               shippingInfo:
 *                 $ref: '#/components/schemas/ShippingInfo'
 *     responses:
 *       201:
 *         description: Order placed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/OrderResponse'
 *       400:
 *         description: Validation error or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Product or combination not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of orders per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, shipped, delivered, cancelled]
 *         description: Filter orders by status
 *     responses:
 *       200:
 *         description: Paginated list of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden — Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Get order details by ID (Admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order MongoDB ObjectId
 *     responses:
 *       200:
 *         description: Detailed order information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       401:
 *         description: Unauthorized — missing or invalid access token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden — Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *         - price
 *         - name
 *       properties:
 *         productId:
 *           type: string
 *           description: MongoDB ObjectId of the product
 *           example: 64b1f2c3d4e5f6789abcde01
 *         combinationId:
 *           type: string
 *           description: MongoDB ObjectId of the product combination (for variant products)
 *           example: 64b1f2c3d4e5f6789abcde10
 *         quantity:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           description: Number of units to order
 *           example: 2
 *         price:
 *           type: number
 *           minimum: 0
 *           description: Unit price of the item
 *           example: 29.99
 *         name:
 *           type: string
 *           description: Product name
 *           example: "Classic T-Shirt"
 *         image:
 *           type: string
 *           description: Product image URL
 *           example: "https://example.com/image.jpg"
 *         variants:
 *           type: array
 *           description: Product variants (size, color, etc.)
 *           items:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: "size"
 *               value:
 *                 type: string
 *                 example: "L"
 *     
 *     ShippingInfo:
 *       type: object
 *       required:
 *         - fullName
 *         - email
 *         - phone
 *         - address
 *         - city
 *         - postalCode
 *       properties:
 *         fullName:
 *           type: string
 *           description: Customer's full name
 *           example: "John Doe"
 *           minLength: 2
 *           maxLength: 100
 *         email:
 *           type: string
 *           format: email
 *           description: Customer's email address
 *           example: "john@example.com"
 *         phone:
 *           type: string
 *           description: Customer's phone number
 *           example: "+1234567890"
 *           minLength: 10
 *           maxLength: 15
 *         address:
 *           type: string
 *           description: Delivery address
 *           example: "123 Main St, Apt 4B"
 *           minLength: 10
 *           maxLength: 300
 *         city:
 *           type: string
 *           description: City name
 *           example: "New York"
 *           minLength: 2
 *         postalCode:
 *           type: string
 *           description: Postal/ZIP code
 *           example: "10001"
 *           minLength: 4
 *           maxLength: 10
 *     
 *     OrderResponse:
 *       type: object
 *       properties:
 *         order_id:
 *           type: string
 *           description: MongoDB ObjectId of the created order
 *           example: 64b1f2c3d4e5f6789abcde99
 *         items:
 *           type: array
 *           description: Array of ordered items with calculated prices
 *           items:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Classic T-Shirt"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               unit_price:
 *                 type: number
 *                 example: 29.99
 *               total_price:
 *                 type: number
 *                 example: 59.98
 *               combination:
 *                 type: array
 *                 description: Variant information (if applicable)
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                     value:
 *                       type: string
 *                 example:
 *                   - type: "size"
 *                     value: "L"
 *                   - type: "color"
 *                     value: "blue"
 *         subtotal:
 *           type: number
 *           description: Subtotal of all items
 *           example: 109.97
 *         total_amount:
 *           type: number
 *           description: Total order amount
 *           example: 109.97
 *         shipping_info:
 *           $ref: '#/components/schemas/ShippingInfo'
 *         status:
 *           type: string
 *           enum: [confirmed, processing, shipped, delivered, cancelled]
 *           description: Order status
 *           example: confirmed
 *     
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *           example: 64b1f2c3d4e5f6789abcde99
 *         user_id:
 *           type: string
 *           description: MongoDB ObjectId of the user who placed the order
 *           example: 64b1f2c3d4e5f6789abcde88
 *         items:
 *           type: array
 *           description: Array of ordered items
 *           items:
 *             type: object
 *             properties:
 *               product_id:
 *                 type: string
 *                 example: 64b1f2c3d4e5f6789abcde01
 *               combination_id:
 *                 type: string
 *                 example: 64b1f2c3d4e5f6789abcde10
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               unit_price:
 *                 type: number
 *                 example: 29.99
 *               total_price:
 *                 type: number
 *                 example: 59.98
 *               product_snapshot:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Classic T-Shirt"
 *                   base_price:
 *                     type: number
 *                     example: 25.00
 *                   image:
 *                     type: string
 *                     example: "https://example.com/image.jpg"
 *               combination_snapshot:
 *                 type: object
 *                 properties:
 *                   option_labels:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                         value:
 *                           type: string
 *                   additional_price:
 *                     type: number
 *                     example: 4.99
 *         subtotal:
 *           type: number
 *           description: Subtotal of all items
 *           example: 109.97
 *         total_amount:
 *           type: number
 *           description: Total order amount
 *           example: 109.97
 *         shipping_info:
 *           $ref: '#/components/schemas/ShippingInfo'
 *         status:
 *           type: string
 *           enum: [confirmed, processing, shipped, delivered, cancelled]
 *           description: Order status
 *           example: confirmed
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Order creation timestamp
 *           example: "2023-07-15T10:30:00.000Z"
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Last update timestamp
 *           example: "2023-07-15T10:30:00.000Z"
 *     
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           description: Error description
 *           example: "Insufficient stock for requested quantity"
 *         error:
 *           type: string
 *           description: Error type (optional)
 *           example: "ValidationError"
 */
