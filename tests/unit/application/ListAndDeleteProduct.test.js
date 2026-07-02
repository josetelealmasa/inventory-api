const ListProducts = require('../../../src/application/usecases/ListProducts');
const DeleteProduct = require('../../../src/application/usecases/DeleteProduct');
const Product = require('../../../src/domain/entities/Product');
const { ProductNotFoundError } = require('../../../src/domain/errors/DomainError');

function createFakeRepository(products = []) {
  const map = new Map(products.map((p) => [p.id, p]));
  return {
    async findAll() {
      return [...map.values()];
    },
    async findById(id) {
      return map.get(id) || null;
    },
    async delete(id) {
      map.delete(id);
    },
  };
}

describe('ListProducts (caso de uso)', () => {
  const lowStock = new Product({
    id: '1',
    sku: 'A',
    name: 'Producto A',
    stock: 1,
    minStock: 5,
    price: 1,
  });
  const okStock = new Product({
    id: '2',
    sku: 'B',
    name: 'Producto B',
    stock: 10,
    minStock: 5,
    price: 1,
  });

  it('lista todos los productos por defecto', async () => {
    const repository = createFakeRepository([lowStock, okStock]);
    const useCase = new ListProducts(repository);
    const result = await useCase.execute();
    expect(result).toHaveLength(2);
  });

  it('filtra solo los que están por debajo del mínimo', async () => {
    const repository = createFakeRepository([lowStock, okStock]);
    const useCase = new ListProducts(repository);
    const result = await useCase.execute({ onlyBelowMinimum: true });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('1');
  });
});

describe('DeleteProduct (caso de uso)', () => {
  const product = new Product({ id: '1', sku: 'A', name: 'Producto A', stock: 1, price: 1 });

  it('elimina un producto existente', async () => {
    const repository = createFakeRepository([product]);
    const useCase = new DeleteProduct(repository);
    await useCase.execute('1');
    expect(await repository.findById('1')).toBeNull();
  });

  it('lanza ProductNotFoundError si no existe', async () => {
    const repository = createFakeRepository([]);
    const useCase = new DeleteProduct(repository);
    await expect(useCase.execute('no-existe')).rejects.toThrow(ProductNotFoundError);
  });
});
