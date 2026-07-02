const express = require('express');
const buildProductRoutes = require('./routes/productRoutes');
const errorHandler = require('./middlewares/errorHandler');

function buildApp({ productController }) {
  const app = express();

  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'salutia-inventory-api' });
  });

  app.use('/api/v1/products', buildProductRoutes(productController));

  // 404 para rutas no encontradas
  app.use((req, res) => {
    res.status(404).json({ error: 'NotFound', message: 'Recurso no encontrado' });
  });

  // El manejador de errores SIEMPRE va al final
  app.use(errorHandler);

  return app;
}

module.exports = buildApp;
