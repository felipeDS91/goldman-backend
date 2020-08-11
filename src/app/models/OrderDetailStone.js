import Sequelize, { Model } from 'sequelize';

class OrderDetailStone extends Model {
  static init(sequelize) {
    super.init(
      {
        amount: Sequelize.FLOAT,
        points: Sequelize.FLOAT,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.OrderDetail, {
      foreignKey: 'id_order_detail',
    });
    this.belongsTo(models.Material, {
      foreignKey: 'id_material',
      as: 'material',
    });
  }
}

export default OrderDetailStone;
