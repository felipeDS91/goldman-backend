import Sequelize, { Model } from 'sequelize';

class OrderStatus extends Model {
  static init(sequelize) {
    super.init(
      {
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
    this.belongsTo(models.Status, {
      foreignKey: 'id_status',
    });
  }
}

export default OrderStatus;
