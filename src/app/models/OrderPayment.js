import Sequelize, { Model } from 'sequelize';

class OrderPayment extends Model {
  static init(sequelize) {
    super.init(
      {
        value: Sequelize.FLOAT,
        date: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Order, {
      foreignKey: 'id_order',
    });
    this.belongsTo(models.PaymentType, {
      foreignKey: 'id_payment_type',
    });
  }
}

export default OrderPayment;
