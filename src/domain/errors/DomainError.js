/**
 * Errores de dominio: no dependen de HTTP, base de datos ni ningún framework.
 * La capa HTTP (infrastructure) se encargará de traducirlos a códigos de estado.
 */

class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
  }
}

class ProductNotFoundError extends DomainError {
  constructor(id) {
    super(`Producto con id "${id}" no encontrado`);
    this.statusCode = 404;
  }
}

class InvalidStockOperationError extends DomainError {
  constructor(message) {
    super(message);
    this.statusCode = 422;
  }
}

class DuplicateProductError extends DomainError {
  constructor(sku) {
    super(`Ya existe un producto con SKU "${sku}"`);
    this.statusCode = 409;
  }
}

module.exports = {
  DomainError,
  ProductNotFoundError,
  InvalidStockOperationError,
  DuplicateProductError,
};
