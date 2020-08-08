import Sequelize from 'sequelize';

import User from '../app/models/User';
import Customer from '../app/models/Customer';
import Order from '../app/models/Order';
import Status from '../app/models/Status';
import PaymentType from '../app/models/PaymentType';
import OrderStatus from '../app/models/OrderStatus';
import OrderPayment from '../app/models/OrderPayment';
import OrderDetail from '../app/models/OrderDetail';
import Finishing from '../app/models/Finishing';
import Material from '../app/models/Material';
import Color from '../app/models/Color';
import Carrier from '../app/models/Carrier';
import FreightType from '../app/models/FreightType';
import OrderDetailStone from '../app/models/OrderDetailStone';
import Company from '../app/models/Company';

import databaseConfig from '../config/database';

const models = [
  User,
  Customer,
  Order,
  Status,
  PaymentType,
  OrderStatus,
  OrderPayment,
  OrderDetail,
  OrderDetailStone,
  Finishing,
  Material,
  Color,
  Carrier,
  FreightType,
  Company,
];

class Database {
  constructor() {
    this.init();
  }

  init() {
    // create new sequelize
    this.connection = new Sequelize(databaseConfig);

    // initialize all modules
    models
      .map(model => model.init(this.connection))
      .map(model => model.associate && model.associate(this.connection.models));
  }
}

export default new Database();
