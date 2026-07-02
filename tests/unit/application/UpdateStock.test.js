const UpdateStock = require('../../../src/application/usecases/UpdateStock');
const Product = require('../../../src/domain/entities/Product');
const { ProductNotFoundError } = require('../../../src/domain/errors/DomainError');

function createFakeRepository(products = []) {
  const map = new Map(products.map((p) => [p.id, p]));
  return {
    async findById(id) {
      return map.get(id) || null;
    },
    async save(product) {
      map.set(product.id, product);
      return product;
    },
  };
}

describe('UpdateStock (caso de uso)', () => {
  const baseProduct = new Product({
    id: 'p1',
    sku: 'AMOX-500',
    name: 'Amoxicilina 500mg',
    stock: 10,
    minStock: 5,
    requiresPrescription: true,
    price: 6.9,
  });

  it('incrementa stock', async () => {
    const repository = createFakeRepository([baseProduct]);
    const useCase = new UpdateStock(repository);

    const product = await useCase.execute('p1', { operation: 'increase', quantity: 5 });

    expect(product.stock).toBe(15);
  });

  it('lanza ProductNotFoundError si el producto no existe', async () => {
    const repository = createFakeRepository([]);
    const useCase = new UpdateStock(repository);

    await expect(
      useCase.execute('no-existe', { operation: 'increase', quantity: 1 })
    ).rejects.toThrow(ProductNotFoundError);
  });
});
