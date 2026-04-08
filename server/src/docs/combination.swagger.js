/**
 * @swagger
 * tags:
 *   name: Combinations
 *   description: Product variant combination configuration
 */

/**
 * @swagger
 * /api/v1/products/{id}/combinations:
 *   get:
 *     summary: List all variant combinations for a product (public)
 *     tags: [Combinations]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product MongoDB ObjectId
 *     responses:
 *       200:
 *         description: List of combinations for the product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Combination'
 *       404:
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/products/combinations/{cid}:
 *   put:
 *     summary: Update stock and/or additional price for a specific combination (Admin only)
 *     tags: [Combinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *         description: Combination MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: integer
 *                 minimum: 0
 *                 description: Updated stock count (must be non-negative integer)
 *                 example: 50
 *               additional_price:
 *                 type: number
 *                 minimum: 0
 *                 description: Extra price added on top of base product price
 *                 example: 5.00
 *     responses:
 *       200:
 *         description: Combination updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Combination'
 *       400:
 *         description: Validation error
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
 *       403:
 *         description: Forbidden — Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Combination not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *
 * /api/v1/products/{id}/combinations/lookup:
 *   post:
 *     summary: Look up a combination by a map of variant-type-to-option-value selections (public)
 *     description: >
 *       Accepts a loose object where keys are variant type names (or IDs) and values are the
 *       selected option values. Returns the matching combination with pricing and stock info.
 *     tags: [Combinations]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product MongoDB ObjectId
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: >
 *               A dynamic key-value map of variant type → selected option
 *               (e.g. { "Color": "Red", "Size": "M" })
 *             additionalProperties:
 *               type: string
 *             example:
 *               Color: Red
 *               Size: M
 *     responses:
 *       200:
 *         description: Matching combination found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/Combination'
 *       404:
 *         description: No matching combination found for the given selections
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
