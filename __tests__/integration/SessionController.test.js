import request from 'supertest';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import app from '../../src/app';
import truncateSequelize from '../utils/database';
import User from '../../src/app/models/User';
import authConfig from '../../src/config/auth';

describe('SessionController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
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

    const logonResponse = await request(app)
      .post('/sessions')
      .send({
        email: 'user@test.com',
        password: '123456',
      });

    const { token } = logonResponse.body;

    const overdueToken = jwt.sign({ id: 1 }, authConfig.secret, {
      expiresIn: 1,
    });

    const response = await request(app)
      .post('/refresh-token')
      .set('Authorization', `Bearer ${token}`)
      .send({
        refreshToken: overdueToken,
      });

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
