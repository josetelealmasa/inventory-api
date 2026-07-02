const { InvalidStockOperationError } = require('../errors/DomainError');

/**
 * Entidad de dominio.
 *
 * Nota didáctica: esta clase NO sabe nada de Express, ni de bases de datos,
 * ni de JSON de request/response. Solo conoce las reglas de negocio de
 * Salutia sobre un producto de inventario farmacéutico. Eso es lo que
 * permite testearla en aislamiento total y reutilizarla si mañana cambia
 * el framework HTTP o el motor de persistencia.
 */
class Product {
  constructor({ id, sku, name, stock, minStock, requiresPrescription, price }) {
    if (!sku || typeof sku !== 'string') {
      throw new InvalidStockOperationError('El SKU es obligatorio y debe ser texto');
    }
    if (!name || typeof name !== 'string') {
      throw new InvalidStockOperationError('El nombre del producto es obligatorio');
    }
    if (typeof price !== 'number' || price < 0) {
      throw new InvalidStockOperationError('El precio debe ser un número mayor o igual a 0');
    }
    if (!Number.isInteger(stock) || stock < 0) {
      throw new InvalidStockOperationError('El stock debe ser un entero mayor o igual a 0');
    }

    this.id = id;
    this.sku = sku;
    this.name = name;
    this.stock = stock;
    this.minStock = minStock ?? 0;
    this.requiresPrescription = Boolean(requiresPrescription);
    this.price = price;
  }

  increaseStock(quantity) {
    this._assertPositiveQuantity(quantity);
    this.stock += quantity;
    return this.stock;
  }

  decreaseStock(quantity) {
    this._assertPositiveQuantity(quantity);
    if (quantity > this.stock) {
      throw new InvalidStockOperationError(
        `No se puede retirar ${quantity} unidades: solo hay ${this.stock} en stock`
      );
    }
    this.stock -= quantity;
    return this.stock;
  }

  isBelowMinimum() {
    return this.stock < this.minStock;
  }

  _assertPositiveQuantity(quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new InvalidStockOperationError('La cantidad debe ser un entero positivo');
    }
  }
}

module.exports = Product;
