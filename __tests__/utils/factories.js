import faker from 'faker';
import fakerbr from 'faker-br';
import { factory } from 'factory-girl';

import User from '../../src/app/models/User';
import Status from '../../src/app/models/Status';
import PaymentType from '../../src/app/models/PaymentType';
import Material from '../../src/app/models/Material';
import Color from '../../src/app/models/Color';
import Finishing from '../../src/app/models/Finishing';
import FreightType from '../../src/app/models/FreightType';
import Carrier from '../../src/app/models/Carrier';
import Customer from '../../src/app/models/Customer';
import Company from '../../src/app/models/Company';
import Order from '../../src/app/models/Order';
import OrderDetail from '../../src/app/models/OrderDetail';
import OrderPayment from '../../src/app/models/OrderPayment';
import OrderDetailStone from '../../src/app/models/OrderDetailStone';

faker.locale = 'pt_BR';

factory.define('User', User, () => ({
  name: faker.name.findName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  profile_admin: false,
}));

factory.define('Company', Company, () => ({
  name: faker.company.companyName(),
  fantasy_name: faker.company.companySuffix(),
  cnpj: fakerbr.br.cnpj(),
  phone: faker.phone.phoneNumber(),
  cellphone: faker.phone.phoneNumber(),
  email: faker.internet.email(),
  instagram: faker.lorem.word(),
  facebook: faker.lorem.word(),
  state: faker.address.stateAbbr(),
  city: faker.address.city(),
  address: faker.address.streetName(),
  neighborhood: faker.address.streetAddress(),
  zip_code: faker.address.zipCode(),
  complement: faker.lorem.paragraph(),
  number: faker.random.number(),
}));

factory.define('Order', Order, () => ({
  grams_used: faker.random.float(),
  delivery_forecast: faker.date.future(),
  delivery_date: faker.date.future(),
  observation: faker.lorem.paragraph(),
  delivery_value: faker.random.float(),
  delivery_state: faker.address.stateAbbr(),
  delivery_city: faker.address.city(),
  delivery_address: faker.address.streetName(),
  delivery_neighborhood: faker.address.streetAddress(),
  delivery_zip_code: faker.address.zipCode(),
  delivery_complement: faker.lorem.paragraph(),
  delivery_number: faker.random.number(),
  paid: faker.random.boolean,
}));

factory.define('OrderDetail', OrderDetail, () => ({
  value: faker.random.float(),
  observation: faker.lorem.paragraph(),
}));

factory.define('OrderPayment', OrderPayment, () => ({
  date: faker.date.future,
}));

factory.define('OrderDetailStone', OrderDetailStone, () => ({
  amount: faker.random.float(),
  points: faker.random.float(),
}));

factory.define('Customer', Customer, () => ({
  name: faker.name.findName(),
  cpf: fakerbr.br.cpf(),
  phone: faker.phone.phoneNumber(),
  cellphone: faker.phone.phoneNumber(),
  email: faker.internet.email(),
  state: faker.address.stateAbbr(),
  city: faker.address.city(),
  address: faker.address.streetName(),
  neighborhood: faker.address.streetAddress(),
  zip_code: faker.address.zipCode(),
  complement: faker.lorem.paragraph(),
  number: faker.random.number(),
  birth_date: faker.date.past(),
  observation: faker.lorem.paragraphs(),
}));

factory.define('Status', Status, () => ({
  description: faker.lorem.word(),
}));

factory.define('PaymentType', PaymentType, () => ({
  description: faker.lorem.word(),
}));

factory.define('Material', Material, () => ({
  description: faker.lorem.word(),
}));

factory.define('Color', Color, () => ({
  description: faker.commerce.color(),
}));

factory.define('Finishing', Finishing, () => ({
  description: faker.lorem.word(),
}));

factory.define('FreightType', FreightType, () => ({
  description: faker.lorem.word(),
}));

factory.define('Carrier', Carrier, () => ({
  name: faker.company.companyName(),
}));

export default factory;
