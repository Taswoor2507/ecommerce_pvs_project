/**
 * @swagger
 * tags:
 *   name: Variants
 *   description: Product variant and option management
 */

/**
 * @swagger
 * /api/v1/products/{id}/variants:
 *   post:
 *     summary: Add variant type to product
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
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
 *               - name
 *               - options
 *             properties:
 *               name:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Variant type added
 *
 * /api/v1/products/{id}/variants/{vid}/options:
 *   post:
 *     summary: Add option to variant type
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: vid
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
 *               - value
 *             properties:
 *               value:
 *                 type: string
 *     responses:
 *       201:
 *         description: Option added
 *
 * /api/v1/products/{id}/variants/{vid}:
 *   delete:
 *     summary: Delete variant type
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: vid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Variant type deleted
 *
 * /api/v1/products/variants/options/{oid}:
 *   delete:
 *     summary: Delete variant option
 *     tags: [Variants]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: oid
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Option deleted
 */
