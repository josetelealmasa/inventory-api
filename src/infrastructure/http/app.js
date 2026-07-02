const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('js-yaml');
const fs = require('fs');
const buildProductRoutes = require('./routes/productRoutes');
const errorHandler = require('./middlewares/errorHandler');

const openapiDocument = YAML.load(
  fs.readFileSync(path.join(__dirname, 'docs', 'openapi.yaml'), 'utf8')
);

function buildApp({ productController }) {
  const app = express();

  app.use(express.json());

  app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', service: 'salutia-inventory-api' });
  });

  // Documentación interactiva: http://localhost:3000/api-docs
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiDocument));

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
