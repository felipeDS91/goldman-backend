import request from 'supertest';
import auth from '../utils/auth';
import app from '../../src/app';
import truncateSequelize from '../utils/database';
import factory from '../utils/factories';

const FACTORY_NAME = 'Status';
const ROUTE = '/status';

describe('StatusController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
  });

  afterAll(async () => {
    await app.database.connection.close();
  });

  const token = auth();

  it(`should return list with paginated ${FACTORY_NAME}`, async () => {
    await factory.createMany(FACTORY_NAME, 19);

    const response = await request(app)
      .get(ROUTE)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body.page).toBe(1);
    expect(response.body.pages).toBe(2);
  });

  it(`should return specific ${FACTORY_NAME} by description`, async () => {
    const registers = await factory.createMany(FACTORY_NAME, 10);

    const response = await request(app)
      .get(ROUTE)
      .query({
        q: registers[5].dataValues.description,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.docs.length).toBeGreaterThan(0);
  });

  it(`should not return ${FACTORY_NAME} that doesn't exists`, async () => {
    const response = await request(app)
      .get(`${ROUTE}/1000`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Registro não localizado.');
  });

  it(`should return ${FACTORY_NAME} by url param`, async () => {
    const registers = await factory.createMany(FACTORY_NAME, 10);

    const response = await request(app)
      .get(`${ROUTE}/${registers[5].dataValues.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(registers[5].dataValues.id);
    expect(response.body.name).toBe(registers[5].dataValues.name);
  });

  it(`should not be able to register ${FACTORY_NAME} without description`, async () => {
    const response = await request(app)
      .post(ROUTE)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it(`should be able to register new ${FACTORY_NAME}`, async () => {
    const register = await factory.attrs(FACTORY_NAME);

    const response = await request(app)
      .post(ROUTE)
      .set('Authorization', `Bearer ${token}`)
      .send(register);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('description');
  });

  it(`should be able to update ${FACTORY_NAME}`, async () => {
    const { dataValues: register } = await factory.create(FACTORY_NAME);
    const newRegister = await factory.attrs(FACTORY_NAME);

    const response = await request(app)
      .put(`${ROUTE}/${register.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newRegister);

    expect(response.status).toBe(200);
  });

  it(`should not be able to update ${FACTORY_NAME} without description`, async () => {
    const { dataValues: register } = await factory.create(FACTORY_NAME);

    const response = await request(app)
      .put(`${ROUTE}/${register.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it(`should not be able to delete ${FACTORY_NAME} that doesn't exists`, async () => {
    const response = await request(app)
      .delete(`${ROUTE}/1000`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Registro não localizado.');
  });

  it(`should be able to delete ${FACTORY_NAME}`, async () => {
    const { dataValues: register } = await factory.create(FACTORY_NAME);

    const response = await request(app)
      .delete(`${ROUTE}/${register.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
