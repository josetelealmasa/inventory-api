/**
 * COMPOSITION ROOT: el único fichero de todo el proyecto que sabe qué
 * adaptador concreto se usa para cada puerto. Si mañana quieres cambiar
 * InMemoryProductRepository por un PostgresProductRepository, este es el
 * único sitio que tocas.
 */
const InMemoryProductRepository = require('../infrastructure/persistence/InMemoryProductRepository');

const CreateProduct = require('../application/usecases/CreateProduct');
const ListProducts = require('../application/usecases/ListProducts');
const GetProductById = require('../application/usecases/GetProductById');
const UpdateStock = require('../application/usecases/UpdateStock');
const DeleteProduct = require('../application/usecases/DeleteProduct');

const ProductController = require('../infrastructure/http/controllers/productController');

function buildContainer() {
  const productRepository = new InMemoryProductRepository();

  const productController = new ProductController({
    createProduct: new CreateProduct(productRepository),
    listProducts: new ListProducts(productRepository),
    getProductById: new GetProductById(productRepository),
    updateStock: new UpdateStock(productRepository),
    deleteProduct: new DeleteProduct(productRepository),
  });

  return { productRepository, productController };
}

module.exports = buildContainer;
