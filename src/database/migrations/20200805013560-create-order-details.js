module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('order_details', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      item_type: {
        type: Sequelize.ENUM('anel', 'outros', 'alianca'),
        allowNull: false,
      },
      id_order: {
        type: Sequelize.INTEGER,
        references: { model: 'orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      value: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 1,
      },
      id_color: {
        type: Sequelize.INTEGER,
        references: { model: 'colors', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      width: {
        type: Sequelize.FLOAT,
      },
      weight: {
        type: Sequelize.FLOAT,
      },
      anatomical: {
        type: Sequelize.BOOLEAN,
      },
      ring_size_1: {
        type: Sequelize.FLOAT,
      },
      ring_size_2: {
        type: Sequelize.FLOAT,
      },
      recording_1: {
        type: Sequelize.STRING,
      },
      recording_2: {
        type: Sequelize.STRING,
      },
      id_finishing: {
        type: Sequelize.INTEGER,
        references: { model: 'finishings', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      observation: {
        type: Sequelize.TEXT,
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
    return queryInterface.dropTable('order_details');
  },
};
