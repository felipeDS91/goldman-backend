import request from 'supertest';
import faker from 'faker';
import auth from '../utils/auth';
import app from '../../src/app';
import truncateSequelize from '../utils/database';
import factory from '../utils/factories';

const FACTORY_NAME = 'Order';
const ROUTE = '/chart-order';

describe('ChartOrderController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
  });

  afterAll(async () => {
    await app.database.connection.close();
  });

  const token = auth();

  it(`should return an array with ${FACTORY_NAME}`, async () => {
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
    });

    const orderPayment = await factory.attrs('OrderPayment', {
      value: faker.random.float(),
      id_order: 1,
      id_payment_type: paymentType.id,
    });

    await factory.create(FACTORY_NAME, {
      total: 100,
      delivery_type: 'loja',
      id_customer: customer.id,
      id_user: user.id,
      id_status: status.id,
      order_details: [orderDetail],
      order_payments: [orderPayment],
    });

    const response = await request(app)
      .get(ROUTE)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body[0]).toHaveProperty('date');
    expect(response.body[0]).toHaveProperty('value');
  });

  it(`should not return an array with filtered ${FACTORY_NAME}`, async () => {
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
    });

    const orderPayment = await factory.attrs('OrderPayment', {
      value: faker.random.float(),
      id_order: 1,
      id_payment_type: paymentType.id,
    });

    await factory.create(FACTORY_NAME, {
      total: 100,
      delivery_type: 'loja',
      id_customer: customer.id,
      id_user: user.id,
      id_status: status.id,
      order_details: [orderDetail],
      order_payments: [orderPayment],
    });

    const response = await request(app)
      .get(ROUTE)
      .query({
        q: ['anel', 'alianca'],
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });
});
