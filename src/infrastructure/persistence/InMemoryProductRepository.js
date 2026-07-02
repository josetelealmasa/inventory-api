const ProductRepository = require('../../domain/ports/ProductRepository');

/**
 * ADAPTADOR (implementación concreta del puerto ProductRepository).
 *
 * En un caso real sustituirías esta clase por una que hable con
 * PostgreSQL, MongoDB, etc., sin tocar ni una línea de la capa de
 * aplicación ni de dominio: solo cambias qué adaptador se inyecta
 * en src/config/container.js.
 */
class InMemoryProductRepository extends ProductRepository {
  constructor() {
    super();
    this._products = new Map();
  }

  async save(product) {
    this._products.set(product.id, product);
    return product;
  }

  async findById(id) {
    return this._products.get(id) || null;
  }

  async findBySku(sku) {
    return [...this._products.values()].find((p) => p.sku === sku) || null;
  }

  async findAll() {
    return [...this._products.values()];
  }

  async delete(id) {
    this._products.delete(id);
  }
}

module.exports = InMemoryProductRepository;
