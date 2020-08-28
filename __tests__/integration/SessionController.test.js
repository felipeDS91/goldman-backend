import request from 'supertest';
import bcrypt from 'bcryptjs';
import MockDate from 'mockdate';
import app from '../../src/app';
import truncateSequelize from '../utils/database';
import User from '../../src/app/models/User';

describe('SessionController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
    MockDate.reset();
  });

  afterAll(async () => {
    await app.database.connection.close();
  });

  it('should not be able to login without email and password', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it('should not be able to login without password', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'admin@gmail.com',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it('should not be able to login without email', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        password: '123456',
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it('should not be able to login with wrong username and password', async () => {
    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'admin@gmail.com',
        password: '123456',
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Usuário ou senha inválido');
  });

  it('should not be able login with wrong password', async () => {
    User.create({
      name: 'User',
      email: 'user@test.com',
      password_hash: await bcrypt.hash('123456', 8),
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'user@test.com',
        password: '444',
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Usuário ou senha inválido');
  });

  it('should return user and token using a correct user and password', async () => {
    User.create({
      name: 'User',
      email: 'user@test.com',
      password_hash: await bcrypt.hash('123456', 8),
    });

    const response = await request(app)
      .post('/sessions')
      .send({
        email: 'user@test.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
  });

  it('should not be able to request new token without token', async () => {
    const response = await request(app)
      .post('/refresh-token')
      .send({});

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Token not provided');
  });

  it('should not be able to request new token with invalid token', async () => {
    const response = await request(app)
      .post('/refresh-token')
      .set('Authorization', `Bearer 1111111111`)
      .send({});

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid access');
  });

  it('should not be able to request new token without refresh token', async () => {
    User.create({
      name: 'User',
      email: 'user@test.com',
      password_hash: await bcrypt.hash('123456', 8),
    });

    const logonResponse = await request(app)
      .post('/sessions')
      .send({
        email: 'user@test.com',
        password: '123456',
      });

    const { token } = logonResponse.body;

    const response = await request(app)
      .post('/refresh-token')
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid access');
  });

  it('should not be able return new token when refresh token is overdue', async () => {
    User.create({
      name: 'User',
      email: 'user@test.com',
      password_hash: await bcrypt.hash('123456', 8),
    });

    MockDate.set('2020-01-01');

    const logonResponse = await request(app)
      .post('/sessions')
      .send({
        email: 'user@test.com',
        password: '123456',
      });

    const { token, refreshToken } = logonResponse.body;

    MockDate.set('2020-02-02');

    const response = await request(app)
      .post('/refresh-token')
      .set('Authorization', `Bearer ${token}`)
      .send({ refreshToken });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Invalid access');
  });

  it('should return new token', async () => {
    User.create({
      name: 'User',
      email: 'user@test.com',
      password_hash: await bcrypt.hash('123456', 8),
    });

    const logonResponse = await request(app)
      .post('/sessions')
      .send({
        email: 'user@test.com',
        password: '123456',
      });

    const { token, refreshToken } = logonResponse.body;

    const response = await request(app)
      .post('/refresh-token')
      .set('Authorization', `Bearer ${token}`)
      .send({ refreshToken });

    expect(response.body).toHaveProperty('token');
  });
});
