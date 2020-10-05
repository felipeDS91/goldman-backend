import request from 'supertest';
import auth from '../utils/auth';
import app from '../../src/app';
import truncateSequelize from '../utils/database';
import factory from '../utils/factories';

const FACTORY_NAME = 'Customer';
const ROUTE = '/customers-report';

describe('CustomerReporController.js', () => {
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
      .query({
        filter: JSON.stringify({
          register_initial_date: new Date(),
          register_final_date: new Date(),
        }),
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });

  it(`should return a list of ${FACTORY_NAME}`, async () => {
    const { dataValues: customer1 } = await factory.create('Customer');
    await factory.create('Customer');
    await factory.create('Customer');

    const response = await request(app)
      .get(`${ROUTE}`)
      .query({
        filter: JSON.stringify({
          city: [customer1.city],
        }),
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
  });
});
