const { ProductNotFoundError } = require('../../domain/errors/DomainError');

class UpdateStock {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id, { operation, quantity }) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }

    if (operation === 'increase') {
      product.increaseStock(quantity);
    } else {
      product.decreaseStock(quantity);
    }

    await this.productRepository.save(product);
    return product;
  }
}

module.exports = UpdateStock;
