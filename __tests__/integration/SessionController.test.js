import request from 'supertest';
import MockDate from 'mockdate';
import app from '../../src/app';
import truncateSequelize from '../utils/database';
import factory from '../utils/factories';

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
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Usuário ou senha inválido');
  });

  it('should not be able login with wrong password', async () => {
    const user = await factory.attrs('User', { password: '123546' });
    factory.create('User', user);

    const response = await request(app)
      .post('/sessions')
      .send({
        ...user,
        password: '654321',
      });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe('Usuário ou senha inválido');
  });

  it('should return user and token using a correct user and password', async () => {
    const user = await factory.attrs('User');
    factory.create('User', user);

    const response = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
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
    const user = await factory.attrs('User');
    factory.create('User', user);

    const logonResponse = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
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
    const user = await factory.attrs('User');
    factory.create('User', user);

    MockDate.set('2020-01-01');

    const logonResponse = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
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
    const user = await factory.attrs('User');
    factory.create('User', user);

    const logonResponse = await request(app)
      .post('/sessions')
      .send({
        email: user.email,
        password: user.password,
      });

    const { token, refreshToken } = logonResponse.body;

    const response = await request(app)
      .post('/refresh-token')
      .set('Authorization', `Bearer ${token}`)
      .send({ refreshToken });

    expect(response.body).toHaveProperty('token');
  });
});
