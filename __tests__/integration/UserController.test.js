import request from 'supertest';
import auth from '../utils/auth';
import app from '../../src/app';
import truncateSequelize from '../utils/database';
import factory from '../utils/factories';

describe('UserController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
  });

  afterAll(async () => {
    await app.database.connection.close();
  });

  it('should not be able to register a user without name, email, password or confirmation password', async () => {
    const token = auth();

    const user = await factory.attrs('User');

    let response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...user, name: undefined });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');

    response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...user, email: undefined });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');

    response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...user, password: undefined });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');

    response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...user, confirmPassword: undefined });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });
});
