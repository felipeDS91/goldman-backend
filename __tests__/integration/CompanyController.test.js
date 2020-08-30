import request from 'supertest';
import auth from '../utils/auth';
import app from '../../src/app';
import truncateSequelize from '../utils/database';
import factory from '../utils/factories';

const FACTORY_NAME = 'Company';
const ROUTE = '/company';

describe('CompanyController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
  });

  afterAll(async () => {
    await app.database.connection.close();
  });

  const token = auth();

  it(`should not return ${FACTORY_NAME} that doesn't exists`, async () => {
    const response = await request(app)
      .get(`${ROUTE}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Registro não localizado.');
  });

  it(`should return ${FACTORY_NAME} by url param`, async () => {
    const { dataValues: register } = await factory.create(FACTORY_NAME);

    const response = await request(app)
      .get(ROUTE)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(register.id);
    expect(response.body.name).toBe(register.name);
  });

  it(`should not be able to register ${FACTORY_NAME} without name`, async () => {
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
    expect(response.body).toHaveProperty('name');
  });

  it(`should be able to update ${FACTORY_NAME}`, async () => {
    await factory.create(FACTORY_NAME);
    const newRegister = await factory.attrs(FACTORY_NAME);

    const response = await request(app)
      .post(ROUTE)
      .set('Authorization', `Bearer ${token}`)
      .send(newRegister);

    expect(response.status).toBe(200);
  });

  it(`should not be able to update ${FACTORY_NAME} with wrong email`, async () => {
    const response = await request(app)
      .post(ROUTE)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: 'aaaa' });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });
});
