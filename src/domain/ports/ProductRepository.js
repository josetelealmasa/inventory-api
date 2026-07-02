/**
 * PUERTO (en terminología hexagonal): define el contrato que cualquier
 * adaptador de persistencia debe cumplir. La capa de aplicación depende
 * de esta interfaz, nunca de una implementación concreta (InMemory, SQL,
 * MongoDB...). Esto es lo que permite cambiar de base de datos sin tocar
 * los casos de uso.
 *
 * En JavaScript no hay "interfaces" reales, así que lo modelamos como una
 * clase base que lanza error si un adaptador no implementa un método.
 */
class ProductRepository {
  async save(_product) {
    throw new Error('Método "save" no implementado');
  }

  async findById(_id) {
    throw new Error('Método "findById" no implementado');
  }

  async findBySku(_sku) {
    throw new Error('Método "findBySku" no implementado');
  }

  async findAll() {
    throw new Error('Método "findAll" no implementado');
  }

  async delete(_id) {
    throw new Error('Método "delete" no implementado');
  }
}

module.exports = ProductRepository;
