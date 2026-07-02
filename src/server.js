require('dotenv').config();

const buildApp = require('./infrastructure/http/app');
const buildContainer = require('./config/container');

const PORT = process.env.PORT || 3000;

const { productController } = buildContainer();
const app = buildApp({ productController });

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Salutia Inventory API escuchando en http://localhost:${PORT}`);
});
