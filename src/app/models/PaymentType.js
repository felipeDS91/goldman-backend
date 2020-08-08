import Sequelize, { Model } from 'sequelize';

class PaymentType extends Model {
  static init(sequelize) {
    super.init(
      {
        description: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default PaymentType;
