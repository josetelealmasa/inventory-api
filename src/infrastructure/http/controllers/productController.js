/**
 * ADAPTADOR de entrada (driving adapter). Su única responsabilidad es
 * traducir HTTP <-> casos de uso. No contiene lógica de negocio: si ves
 * una regla de negocio aquí, es una señal de que se ha colado en la capa
 * equivocada.
 */
class ProductController {
  constructor({ createProduct, listProducts, getProductById, updateStock, deleteProduct }) {
    this.createProduct = createProduct;
    this.listProducts = listProducts;
    this.getProductById = getProductById;
    this.updateStock = updateStock;
    this.deleteProduct = deleteProduct;
  }

  create = async (req, res, next) => {
    try {
      const product = await this.createProduct.execute(req.body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  };

  list = async (req, res, next) => {
    try {
      const onlyBelowMinimum = req.query.belowMinimum === 'true';
      const products = await this.listProducts.execute({ onlyBelowMinimum });
      res.status(200).json(products);
    } catch (err) {
      next(err);
    }
  };

  getById = async (req, res, next) => {
    try {
      const product = await this.getProductById.execute(req.params.id);
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  };

  patchStock = async (req, res, next) => {
    try {
      const product = await this.updateStock.execute(req.params.id, req.body);
      res.status(200).json(product);
    } catch (err) {
      next(err);
    }
  };

  remove = async (req, res, next) => {
    try {
      await this.deleteProduct.execute(req.params.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = ProductController;
