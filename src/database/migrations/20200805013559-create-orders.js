module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      id_customer: {
        type: Sequelize.INTEGER,
        references: { model: 'customers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      id_user: {
        type: Sequelize.INTEGER,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      id_status: {
        type: Sequelize.INTEGER,
        references: { model: 'statuses', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      grams_used: {
        type: Sequelize.FLOAT,
      },
      delivery_forecast: {
        type: Sequelize.DATE,
      },
      delivery_date: {
        type: Sequelize.DATE,
      },
      delivery_type: {
        type: Sequelize.ENUM('transportadora', 'loja', 'motoboy'),
        allowNull: false,
      },
      delivery_value: {
        type: Sequelize.FLOAT,
      },
      delivery_id_carrier: {
        type: Sequelize.INTEGER,
        references: { model: 'carriers', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      delivery_id_freight_type: {
        type: Sequelize.INTEGER,
        references: { model: 'freight_types', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      delivery_zip_code: {
        type: Sequelize.STRING,
      },
      delivery_state: {
        type: Sequelize.STRING,
      },
      delivery_city: {
        type: Sequelize.STRING,
      },
      delivery_neighborhood: {
        type: Sequelize.STRING,
      },
      delivery_address: {
        type: Sequelize.STRING,
      },
      delivery_number: {
        type: Sequelize.STRING,
      },
      delivery_complement: {
        type: Sequelize.STRING,
      },
      observation: {
        type: Sequelize.TEXT,
      },
      total: {
        type: Sequelize.FLOAT,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('orders');
  },
};
