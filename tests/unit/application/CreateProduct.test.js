const CreateProduct = require('../../../src/application/usecases/CreateProduct');
const { DuplicateProductError } = require('../../../src/domain/errors/DomainError');

/**
 * Repositorio falso en memoria, usado solo para tests.
 * Como CreateProduct depende del PUERTO (interfaz), no de una
 * implementación concreta, podemos sustituirlo libremente en el test.
 */
function createFakeRepository(seed = []) {
  const products = new Map(seed.map((p) => [p.id, p]));
  return {
    async findBySku(sku) {
      return [...products.values()].find((p) => p.sku === sku) || null;
    },
    async save(product) {
      products.set(product.id, product);
      return product;
    },
  };
}

describe('CreateProduct (caso de uso)', () => {
  const validInput = {
    sku: 'IBU-400',
    name: 'Ibuprofeno 400mg',
    stock: 20,
    minStock: 5,
    requiresPrescription: false,
    price: 4.2,
  };

  it('crea el producto cuando el SKU no existe', async () => {
    const repository = createFakeRepository();
    const useCase = new CreateProduct(repository);

    const product = await useCase.execute(validInput);

    expect(product.sku).toBe('IBU-400');
    expect(await repository.findBySku('IBU-400')).not.toBeNull();
  });

  it('lanza DuplicateProductError si el SKU ya existe', async () => {
    const repository = createFakeRepository([{ id: 'x', sku: 'IBU-400' }]);
    const useCase = new CreateProduct(repository);

    await expect(useCase.execute(validInput)).rejects.toThrow(DuplicateProductError);
  });
});
