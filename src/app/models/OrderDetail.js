import Sequelize, { Model } from 'sequelize';

class OrderDetail extends Model {
  static init(sequelize) {
    super.init(
      {
        item_type: Sequelize.STRING,
        description: Sequelize.STRING,
        value: Sequelize.FLOAT,
        amount: Sequelize.FLOAT,
        width: Sequelize.FLOAT,
        weight: Sequelize.FLOAT,
        anatomical: Sequelize.BOOLEAN,
        ring_size_1: Sequelize.FLOAT,
        ring_size_2: Sequelize.FLOAT,
        recording_1: Sequelize.STRING,
        recording_2: Sequelize.STRING,
        observation: Sequelize.STRING,
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
    this.belongsTo(models.Color, {
      foreignKey: 'id_color',
      as: 'color',
    });
    this.belongsTo(models.Finishing, {
      foreignKey: 'id_finishing',
      as: 'finishing',
    });
    this.hasMany(models.OrderDetailStone, {
      foreignKey: 'id_order_detail',
      as: 'order_detail_stones',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

export default OrderDetail;
