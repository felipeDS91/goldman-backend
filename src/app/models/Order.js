import Sequelize, { Model } from 'sequelize';

class Order extends Model {
  static init(sequelize) {
    super.init(
      {
        grams_used: Sequelize.FLOAT,
        delivery_forecast: Sequelize.DATE,
        delivery_date: Sequelize.DATE,
        observation: Sequelize.TEXT,
        total: Sequelize.FLOAT,
        delivery_type: Sequelize.STRING,
        delivery_value: Sequelize.FLOAT,
        delivery_zip_code: Sequelize.STRING,
        delivery_state: Sequelize.STRING,
        delivery_city: Sequelize.STRING,
        delivery_neighborhood: Sequelize.STRING,
        delivery_address: Sequelize.STRING,
        delivery_number: Sequelize.STRING,
        delivery_complement: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Customer, {
      foreignKey: 'id_customer',
      as: 'customer',
    });
    this.belongsTo(models.User, {
      foreignKey: 'id_user',
      as: 'user',
    });
    this.belongsTo(models.Status, {
      foreignKey: 'id_status',
      as: 'status',
    });
    this.belongsTo(models.Carrier, {
      foreignKey: 'delivery_id_carrier',
      as: 'delivery_carrier',
    });
    this.belongsTo(models.FreightType, {
      foreignKey: 'delivery_id_freight_type',
      as: 'delivery_freight_type',
    });
    this.hasMany(models.OrderDetail, {
      foreignKey: 'id_order',
      as: 'order_details',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
    this.hasMany(models.OrderPayment, {
      foreignKey: 'id_order',
      as: 'order_payments',
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    });
  }
}

export default Order;
