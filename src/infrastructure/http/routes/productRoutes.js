const { Router } = require('express');
const Joi = require('joi');
const validateRequest = require('../middlewares/validateRequest');

const createProductSchema = Joi.object({
  sku: Joi.string().trim().min(3).max(30).required(),
  name: Joi.string().trim().min(2).max(120).required(),
  stock: Joi.number().integer().min(0).required(),
  minStock: Joi.number().integer().min(0).default(0),
  requiresPrescription: Joi.boolean().default(false),
  price: Joi.number().min(0).required(),
});

const updateStockSchema = Joi.object({
  operation: Joi.string().valid('increase', 'decrease').required(),
  quantity: Joi.number().integer().positive().required(),
});

function buildProductRoutes(productController) {
  const router = Router();

  router.post('/', validateRequest(createProductSchema), productController.create);
  router.get('/', productController.list);
  router.get('/:id', productController.getById);
  router.patch('/:id/stock', validateRequest(updateStockSchema), productController.patchStock);
  router.delete('/:id', productController.remove);

  return router;
}

module.exports = buildProductRoutes;
