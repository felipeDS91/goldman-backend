import request from 'supertest';
import faker from 'faker';
import auth from '../utils/auth';
import app from '../../src/app';
import truncateSequelize from '../utils/database';
import factory from '../utils/factories';

const FACTORY_NAME = 'Order';
const ROUTE = '/orders';

describe('OrderController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
  });

  afterAll(async () => {
    await app.database.connection.close();
  });

  const token = auth();

  it(`should not return ${FACTORY_NAME} that doesn't exists`, async () => {
    const response = await request(app)
      .get(`${ROUTE}/1000`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Registro não localizado.');
  });

  it(`should not be able to register ${FACTORY_NAME} without data`, async () => {
    const response = await request(app)
      .post(ROUTE)
      .set('Authorization', `Bearer ${token}`)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it(`should be able to register new ${FACTORY_NAME}`, async () => {
    const { dataValues: customer } = await factory.create('Customer');
    const { dataValues: status } = await factory.create('Status');
    const { dataValues: user } = await factory.create('User');
    const { dataValues: paymentType } = await factory.create('PaymentType');

    const orderDetail = await factory.attrs('OrderDetail', {
      item_type: 'outros',
      description: faker.lorem.words(),
      amount: faker.random.number(),
      value: 100,
      id_order: 1,
    }); // pegar o value daqui

    const orderPayment = await factory.attrs('OrderPayment', {
      value: faker.random.float(),
      id_order: 1,
      id_payment_type: paymentType.id,
    }); // pegar o value daqui

    const order = await factory.attrs(FACTORY_NAME, {
      total: 100,
      delivery_type: 'loja',
      id_customer: customer.id,
      id_user: user.id,
      id_status: status.id,
      order_details: [orderDetail],
      order_payments: [orderPayment],
    });

    const response = await request(app)
      .post(ROUTE)
      .set('Authorization', `Bearer ${token}`)
      .send(order);

    console.log(response);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    // expect(response.body).toHaveProperty('name');
  });

  // it(`should be able to update ${FACTORY_NAME}`, async () => {
  //   const { dataValues: register } = await factory.create(FACTORY_NAME);
  //   const newRegister = await factory.attrs(FACTORY_NAME);

  //   const response = await request(app)
  //     .put(`${ROUTE}/${register.id}`)
  //     .set('Authorization', `Bearer ${token}`)
  //     .send(newRegister);

  //   expect(response.status).toBe(200);
  // });

  // it(`should not be able to update ${FACTORY_NAME} with wrong email`, async () => {
  //   const { dataValues: register } = await factory.create(FACTORY_NAME);

  //   const response = await request(app)
  //     .put(`${ROUTE}/${register.id}`)
  //     .set('Authorization', `Bearer ${token}`)
  //     .send({ email: 'aaaa' });

  //   expect(response.status).toBe(400);
  //   expect(response.body.error).toBe('Validation fails');
  // });

  it(`should not be able to delete ${FACTORY_NAME} that doesn't exists`, async () => {
    const response = await request(app)
      .delete(`${ROUTE}/1000`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Registro não localizado.');
  });

  // it(`should be able to delete ${FACTORY_NAME}`, async () => {
  //   const { dataValues: register } = await factory.create(FACTORY_NAME);

  //   const response = await request(app)
  //     .delete(`${ROUTE}/${register.id}`)
  //     .set('Authorization', `Bearer ${token}`);

  //   expect(response.status).toBe(200);
  // });
});
