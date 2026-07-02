const { randomUUID } = require('crypto');
const Product = require('../../domain/entities/Product');
const { DuplicateProductError } = require('../../domain/errors/DomainError');

class CreateProduct {
  /**
   * @param {import('../../domain/ports/ProductRepository')} productRepository
   */
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute({ sku, name, stock, minStock, requiresPrescription, price }) {
    const existing = await this.productRepository.findBySku(sku);
    if (existing) {
      throw new DuplicateProductError(sku);
    }

    const product = new Product({
      id: randomUUID(),
      sku,
      name,
      stock,
      minStock,
      requiresPrescription,
      price,
    });

    await this.productRepository.save(product);
    return product;
  }
}

module.exports = CreateProduct;
