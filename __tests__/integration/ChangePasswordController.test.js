import request from 'supertest';
import faker from 'faker';
import auth from '../utils/auth';
import app from '../../src/app';
import truncateSequelize from '../utils/database';
import factory from '../utils/factories';

describe('ChangePasswordController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
  });

  afterAll(async () => {
    await app.database.connection.close();
  });

  it('should not be able to change the password without confirmation password', async () => {
    const { dataValues: user } = await factory.create('User');

    const token = auth(user.id);

    const newPassword = faker.internet.password();

    const response = await request(app)
      .put('/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: newPassword,
        oldPassword: user.password,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it('should not be able to change the password without current password', async () => {
    const { dataValues: user } = await factory.create('User');

    const token = auth(user.id);

    const newPassword = faker.internet.password();

    const response = await request(app)
      .put('/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: newPassword,
        confirmPassword: newPassword,
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it('should not be able to change the password with wrong current password', async () => {
    const { dataValues: user } = await factory.create('User');

    const token = auth(user.id);

    const newPassword = faker.internet.password();

    const response = await request(app)
      .put('/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: newPassword,
        confirmPassword: newPassword,
        oldPassword: '11111111',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it('should change password', async () => {
    const { dataValues: user } = await factory.create('User');

    const token = auth(user.id);

    const newPassword = faker.internet.password();

    const response = await request(app)
      .put('/change-password')
      .set('Authorization', `Bearer ${token}`)
      .send({
        password: newPassword,
        confirmPassword: newPassword,
        oldPassword: user.password,
      });

    expect(response.status).toBe(200);
    expect(response.body.password).toBe(newPassword);
  });
});
