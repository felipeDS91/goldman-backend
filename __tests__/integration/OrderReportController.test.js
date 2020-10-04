import request from 'supertest';
import faker from 'faker';
import auth from '../utils/auth';
import app from '../../src/app';
import truncateSequelize from '../utils/database';
import factory from '../utils/factories';

const FACTORY_NAME = 'Order';
const ROUTE = '/orders-report';

describe('OrderReportController.js', () => {
  beforeEach(async () => {
    await truncateSequelize();
  });

  afterAll(async () => {
    await app.database.connection.close();
  });

  const token = auth();

  it(`should not return any ${FACTORY_NAME}`, async () => {
    const response = await request(app)
      .get(ROUTE)
      .query({
        filter: JSON.stringify({
          id_customer: '',
          id_user: [],
          delivery_type: [],
          status: [],
          paid: true,
          total_initial_value: '0',
          total_final_value: '0',
          observation: '',
          order_initial_date: new Date(),
          order_final_date: new Date(),
          delivery_initial_date: new Date(),
          delivery_final_date: new Date(),
          id_payment_type: [1],
          type: ['outros'],
        }),
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(0);
  });

  it(`should return ${FACTORY_NAME}`, async () => {
    const { dataValues: customer } = await factory.create('Customer');
    const { dataValues: status } = await factory.create('Status');
    const { dataValues: user } = await factory.create('User');
    const { dataValues: paymentType } = await factory.create('PaymentType');

    const orderDetail = await factory.attrs('OrderDetail', {
      item_type: 'outros',
      description: faker.lorem.words(),
      amount: faker.random.number(),
      value: 100,
    });

    const orderPayment = await factory.attrs('OrderPayment', {
      value: 100,
      id_payment_type: paymentType.id,
    });

    const { dataValues: order } = await factory.create(FACTORY_NAME, {
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
        filter: JSON.stringify({
          id_customer: customer.id,
          id_user: [user.id],
          delivery_type: [order.delivery_type],
          id_status: [order.id_status],
          total_initial_value: 10,
          total_final_value: 200,
          observation: order.observation,
        }),
      })
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty('id');
  });
});
