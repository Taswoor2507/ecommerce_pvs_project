/**
 * @swagger
 * tags:
 *   name: Combinations
 *   description: Variant combination configuration
 */

/**
 * @swagger
 * /api/v1/products/{id}/combinations:
 *   get:
 *     summary: List combinations for a product
 *     tags: [Combinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of combinations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Combination'
 *
 * /api/v1/products/combinations/{cid}:
 *   put:
 *     summary: Update specific combination
 *     tags: [Combinations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: integer
 *               additional_price:
 *                 type: number
 *     responses:
 *       200:
 *         description: Combination updated
 *
 * /api/v1/products/{id}/combinations/lookup:
 *   post:
 *     summary: Look up combination by options
 *     tags: [Combinations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - options
 *             properties:
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of option IDs
 *     responses:
 *       200:
 *         description: Combination found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Combination'
 */
