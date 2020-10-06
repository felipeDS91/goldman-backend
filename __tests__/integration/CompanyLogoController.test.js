import request from 'supertest';
import path from 'path';
import auth from '../utils/auth';
import app from '../../src/app';
import truncateSequelize from '../utils/database';
import factory from '../utils/factories';

const FACTORY_NAME = 'Company';
const ROUTE = '/company/logo';

const logoPath = path.resolve(__dirname, '..', 'utils', 'test-logo.svg');

describe('CompanyLogoController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
  });

  afterAll(async () => {
    await app.database.connection.close();
  });

  const token = auth();

  it(`should not be able to update ${FACTORY_NAME} without an image`, async () => {
    await factory.create('Company');
    const response = await request(app)
      .patch(`${ROUTE}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it(`should be able to update ${FACTORY_NAME} with an image`, async () => {
    await factory.create('Company');

    const response = await request(app)
      .patch(ROUTE)
      .attach('file', logoPath)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('logo_name');
  });
});
