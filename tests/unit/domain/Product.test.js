const Product = require('../../../src/domain/entities/Product');
const { InvalidStockOperationError } = require('../../../src/domain/errors/DomainError');

describe('Product (entidad de dominio)', () => {
  const validProps = {
    id: '1',
    sku: 'PARA-500',
    name: 'Paracetamol 500mg',
    stock: 10,
    minStock: 5,
    requiresPrescription: false,
    price: 3.5,
  };

  it('crea un producto válido', () => {
    const product = new Product(validProps);
    expect(product.stock).toBe(10);
    expect(product.isBelowMinimum()).toBe(false);
  });

  it('rechaza precio negativo', () => {
    expect(() => new Product({ ...validProps, price: -1 })).toThrow(InvalidStockOperationError);
  });

  it('rechaza stock no entero', () => {
    expect(() => new Product({ ...validProps, stock: 3.2 })).toThrow(InvalidStockOperationError);
  });

  it('incrementa stock correctamente', () => {
    const product = new Product(validProps);
    product.increaseStock(5);
    expect(product.stock).toBe(15);
  });

  it('decrementa stock correctamente', () => {
    const product = new Product(validProps);
    product.decreaseStock(4);
    expect(product.stock).toBe(6);
  });

  it('lanza error al decrementar más stock del disponible', () => {
    const product = new Product(validProps);
    expect(() => product.decreaseStock(100)).toThrow(InvalidStockOperationError);
  });

  it('detecta cuándo el stock está por debajo del mínimo', () => {
    const product = new Product({ ...validProps, stock: 2, minStock: 5 });
    expect(product.isBelowMinimum()).toBe(true);
  });
});
