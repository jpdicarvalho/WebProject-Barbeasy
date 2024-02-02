/** swaggerComments.js
 * @swagger
 * /api/status-update:
 *   post:
 *     summary: Rota para atualizar o status da barbearia 'Aberta' ou 'Fechada'
 *     description: Rota utilizada para alterar o status de uma barbearia entre 'Aberta' e 'Fechada'.
 *     tags:
 *       - Status
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Objeto contendo o status da barbearia a ser atualizado
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             Status:
 *               type: string
 *               enum: [Aberta, Fechada]
 *               description: Novo status da barbearia
 *     responses:
 *       200:
 *         description: Sucesso ao atualizar o status da barbearia
 *       500:
 *         description: Erro interno do servidor ao atualizar o status da barbearia
 */
