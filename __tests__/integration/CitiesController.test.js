import request from 'supertest';
import auth from '../utils/auth';
import app from '../../src/app';
import truncateSequelize from '../utils/database';
import factory from '../utils/factories';

const FACTORY_NAME = 'City';
const ROUTE = '/cities';

describe('Cities.js', () => {
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

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });

  it(`should return grouped customer ${FACTORY_NAME}`, async () => {
    await factory.create('Customer', {
      city: 'New York',
    });
    await factory.create('Customer', {
      city: 'São Paulo',
    });
    await factory.create('Customer', {
      city: 'São Paulo',
    });

    const response = await request(app)
      .get(`${ROUTE}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
  });
});
