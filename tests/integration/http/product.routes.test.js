const request = require('supertest');
const buildApp = require('../../../src/infrastructure/http/app');
const buildContainer = require('../../../src/config/container');

describe('API de productos (integración)', () => {
  let app;

  beforeEach(() => {
    // Contenedor nuevo en cada test => repositorio en memoria limpio,
    // los tests quedan aislados entre sí.
    const { productController } = buildContainer();
    app = buildApp({ productController });
  });

  it('GET /health responde ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });

  it('crea un producto y lo recupera por id', async () => {
    const createRes = await request(app).post('/api/v1/products').send({
      sku: 'PARA-500',
      name: 'Paracetamol 500mg',
      stock: 15,
      minStock: 5,
      requiresPrescription: false,
      price: 3.5,
    });

    expect(createRes.status).toBe(201);
    const { id } = createRes.body;

    const getRes = await request(app).get(`/api/v1/products/${id}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.sku).toBe('PARA-500');
  });

  it('rechaza creación con payload inválido (400)', async () => {
    const res = await request(app).post('/api/v1/products').send({ sku: 'AB' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('ValidationError');
  });

  it('devuelve 404 al pedir un producto inexistente', async () => {
    const res = await request(app).get('/api/v1/products/no-existe');
    expect(res.status).toBe(404);
  });

  it('actualiza stock via PATCH', async () => {
    const createRes = await request(app).post('/api/v1/products').send({
      sku: 'IBU-400',
      name: 'Ibuprofeno 400mg',
      stock: 10,
      price: 4.2,
    });
    const { id } = createRes.body;

    const patchRes = await request(app)
      .patch(`/api/v1/products/${id}/stock`)
      .send({ operation: 'decrease', quantity: 3 });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.stock).toBe(7);
  });

  it('devuelve 409 si se crea un SKU duplicado', async () => {
    const payload = { sku: 'DUP-1', name: 'Producto duplicado', stock: 1, price: 1 };
    await request(app).post('/api/v1/products').send(payload);
    const res = await request(app).post('/api/v1/products').send(payload);
    expect(res.status).toBe(409);
  });

  it('lista productos y filtra por belowMinimum', async () => {
    await request(app)
      .post('/api/v1/products')
      .send({ sku: 'LOW-1', name: 'Bajo mínimo', stock: 1, minStock: 5, price: 1 });
    await request(app)
      .post('/api/v1/products')
      .send({ sku: 'OK-1', name: 'Stock normal', stock: 20, minStock: 5, price: 1 });

    const listRes = await request(app).get('/api/v1/products');
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveLength(2);

    const filteredRes = await request(app).get('/api/v1/products?belowMinimum=true');
    expect(filteredRes.status).toBe(200);
    expect(filteredRes.body).toHaveLength(1);
    expect(filteredRes.body[0].sku).toBe('LOW-1');
  });

  it('elimina un producto existente (204) y luego devuelve 404 al buscarlo', async () => {
    const createRes = await request(app)
      .post('/api/v1/products')
      .send({ sku: 'DEL-1', name: 'A borrar', stock: 1, price: 1 });
    const { id } = createRes.body;

    const deleteRes = await request(app).delete(`/api/v1/products/${id}`);
    expect(deleteRes.status).toBe(204);

    const getRes = await request(app).get(`/api/v1/products/${id}`);
    expect(getRes.status).toBe(404);
  });

  it('devuelve 404 al intentar borrar un producto inexistente', async () => {
    const res = await request(app).delete('/api/v1/products/no-existe');
    expect(res.status).toBe(404);
  });
});
