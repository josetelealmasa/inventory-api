class ListProducts {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute({ onlyBelowMinimum = false } = {}) {
    const products = await this.productRepository.findAll();
    if (!onlyBelowMinimum) {
      return products;
    }
    return products.filter((product) => product.isBelowMinimum());
  }
}

module.exports = ListProducts;
