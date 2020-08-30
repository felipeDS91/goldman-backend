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

  const token = auth();

  it('should return a list with paginated users', async () => {
    await factory.createMany('User', 19);

    const response = await request(app)
      .get('/users')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('docs');
    expect(response.body.page).toBe(1);
    expect(response.body.pages).toBe(2);
  });

  it('should return an specific user by name', async () => {
    const users = await factory.createMany('User', 10);

    const response = await request(app)
      .get('/users')
      .query({
        q: users[5].dataValues.name,
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.docs[0].name).toBe(users[5].dataValues.name);
  });

  it(`should not return an user that doesn't exists`, async () => {
    const response = await request(app)
      .get(`/users/1000`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Registro não localizado.');
  });

  it('should return an user by url param', async () => {
    const users = await factory.createMany('User', 10);

    const response = await request(app)
      .get(`/users/${users[5].dataValues.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(users[5].dataValues.id);
    expect(response.body.name).toBe(users[5].dataValues.name);
  });

  it('should not be able to register a user without name, email, password or confirmation password', async () => {
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

  it('should not be able to include an user with duplicated email address', async () => {
    const { dataValues: user } = await factory.create('User');

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...user, confirmPassword: user.password });
    expect(response.status).toBe(400);
    expect(response.body.error).toBe(
      'Email cadastrado para esse usuário já existe'
    );
  });

  it('should be able to register an new user', async () => {
    const user = await factory.attrs('User');

    const response = await request(app)
      .post('/users')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...user, confirmPassword: user.password });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('name');
  });

  it('should not be able to update an user with an email already used', async () => {
    const users = await factory.createMany('User', 2);

    const response = await request(app)
      .put(`/users/${users[1].dataValues.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ email: users[0].dataValues.email });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it('should not be able to update an user without confirmationPassword', async () => {
    const { dataValues: user } = await factory.create('User');
    const newUser = await factory.attrs('User');

    const response = await request(app)
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newUser);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it('should be able to update an user', async () => {
    const { dataValues: user } = await factory.create('User');
    const newUser = await factory.attrs('User');

    const response = await request(app)
      .put(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ ...newUser, confirmPassword: newUser.password });
    expect(response.status).toBe(200);

    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
  });

  it(`should not be able to delete an user that doesn't exists`, async () => {
    const response = await request(app)
      .delete(`/users/1000`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Registro não localizado.');
  });

  it('should be able to delete an user', async () => {
    const { dataValues: user } = await factory.create('User');

    const response = await request(app)
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
