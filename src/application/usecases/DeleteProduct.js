const { ProductNotFoundError } = require('../../domain/errors/DomainError');

class DeleteProduct {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id) {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new ProductNotFoundError(id);
    }
    await this.productRepository.delete(id);
  }
}

module.exports = DeleteProduct;
