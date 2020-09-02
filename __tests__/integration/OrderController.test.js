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

  it(`should return list with paginated ${FACTORY_NAME}`, async () => {
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
    expect(response.body).toHaveProperty('docs');
    expect(response.body.page).toBe(1);
    expect(response.body.pages).toBe(1);
  });

  it(`should return ${FACTORY_NAME} by url param`, async () => {
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
      .get(`${ROUTE}/${order.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.id).toBe(order.id);
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
    });

    const orderPayment = await factory.attrs('OrderPayment', {
      value: faker.random.float(),
      id_order: 1,
      id_payment_type: paymentType.id,
    });

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

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it(`should be able to register new ${FACTORY_NAME} with ring stone`, async () => {
    const { dataValues: customer } = await factory.create('Customer');
    const { dataValues: status } = await factory.create('Status');
    const { dataValues: user } = await factory.create('User');
    const { dataValues: paymentType } = await factory.create('PaymentType');
    const { dataValues: color } = await factory.create('Color');
    const { dataValues: material } = await factory.create('Material');

    const orderDetailStone = await factory.attrs('OrderDetailStone', {
      id_material: material.id,
      id_order_detail: 1,
    });

    const orderDetail = await factory.attrs('OrderDetail', {
      item_type: 'anel',
      ring_size_1: 15,
      id_color: color.id,
      value: 100,
      id_order: 1,
      order_detail_stones: [orderDetailStone],
    });

    const orderPayment = await factory.attrs('OrderPayment', {
      value: faker.random.float(),
      id_order: 1,
      id_payment_type: paymentType.id,
    });

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

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
  });

  it(`should not be able to register new ${FACTORY_NAME} without payment`, async () => {
    const { dataValues: customer } = await factory.create('Customer');
    const { dataValues: status } = await factory.create('Status');
    const { dataValues: user } = await factory.create('User');

    const orderDetail = await factory.attrs('OrderDetail', {
      item_type: 'outros',
      description: faker.lorem.words(),
      amount: faker.random.number(),
      value: 100,
      id_order: 1,
    });

    const order = await factory.attrs(FACTORY_NAME, {
      total: 100,
      delivery_type: 'loja',
      id_customer: customer.id,
      id_user: user.id,
      id_status: status.id,
      order_details: [orderDetail],
    });

    const response = await request(app)
      .post(ROUTE)
      .set('Authorization', `Bearer ${token}`)
      .send(order);

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it(`should be able to update ${FACTORY_NAME}`, async () => {
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

    const { dataValues: order } = await factory.create(FACTORY_NAME, {
      total: 100,
      delivery_type: 'loja',
      id_customer: customer.id,
      id_user: user.id,
      id_status: status.id,
      order_details: [orderDetail],
      order_payments: [orderPayment],
    });

    const newOrderDetail = await factory.attrs('OrderDetail', {
      item_type: 'outros',
      description: faker.lorem.words(),
      amount: faker.random.number(),
      value: 80,
      id_order: 1,
    });

    const newOrderPayment = await factory.attrs('OrderPayment', {
      value: 80,
      id_order: 1,
      id_payment_type: paymentType.id,
    });

    const response = await request(app)
      .put(`${ROUTE}/${order.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...order,
        order_details: [newOrderDetail],
        order_payments: [newOrderPayment],
      });

    expect(response.status).toBe(200);
  });

  it(`should be able to update ${FACTORY_NAME} with ring stone`, async () => {
    const { dataValues: customer } = await factory.create('Customer');
    const { dataValues: status } = await factory.create('Status');
    const { dataValues: user } = await factory.create('User');
    const { dataValues: paymentType } = await factory.create('PaymentType');
    const { dataValues: color } = await factory.create('Color');
    const { dataValues: material } = await factory.create('Material');

    const orderDetailStone = await factory.attrs('OrderDetailStone', {
      id_material: material.id,
      id_order_detail: 1,
    });

    const orderDetail = await factory.attrs('OrderDetail', {
      item_type: 'anel',
      ring_size_1: 15,
      id_color: color.id,
      value: 100,
      id_order: 1,
      order_detail_stones: [orderDetailStone],
    });

    const orderPayment = await factory.attrs('OrderPayment', {
      value: faker.random.float(),
      id_order: 1,
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

    const newOrderDetailStone = await factory.attrs('OrderDetailStone', {
      id_material: material.id,
      id_order_detail: 1,
    });

    const newOrderDetail = await factory.attrs('OrderDetail', {
      item_type: 'anel',
      ring_size_1: 15,
      id_color: color.id,
      value: 80,
      id_order: 1,
      order_detail_stones: [newOrderDetailStone],
    });

    const newOrderPayment = await factory.attrs('OrderPayment', {
      value: 80,
      id_order: 1,
      id_payment_type: paymentType.id,
    });

    const response = await request(app)
      .put(`${ROUTE}/${order.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...order,
        order_details: [newOrderDetail],
        order_payments: [newOrderPayment],
      });

    expect(response.status).toBe(200);
  });

  it(`should not be able to update ${FACTORY_NAME} without detail`, async () => {
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

    const { dataValues: order } = await factory.create(FACTORY_NAME, {
      total: 100,
      delivery_type: 'loja',
      id_customer: customer.id,
      id_user: user.id,
      id_status: status.id,
      order_details: [orderDetail],
      order_payments: [orderPayment],
    });

    const newOrderPayment = await factory.attrs('OrderPayment', {
      value: 80,
      id_order: 1,
      id_payment_type: paymentType.id,
    });

    const response = await request(app)
      .put(`${ROUTE}/${order.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        ...order,
        order_details: undefined,
        order_payments: [newOrderPayment],
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('Validation fails');
  });

  it(`should not be able to delete ${FACTORY_NAME} that doesn't exists`, async () => {
    const response = await request(app)
      .delete(`${ROUTE}/1000`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Registro não localizado.');
  });

  it(`should be able to delete ${FACTORY_NAME}`, async () => {
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
      .delete(`${ROUTE}/${order.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
  });
});
