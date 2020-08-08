module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('customers', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cpf: {
        type: Sequelize.STRING(11),
        allowNull: false,
        unique: true,
      },
      phone: {
        type: Sequelize.STRING(16),
      },
      cellphone: {
        type: Sequelize.STRING(16),
      },
      email: {
        type: Sequelize.STRING(150),
      },
      state: {
        type: Sequelize.STRING(2),
      },
      city: {
        type: Sequelize.STRING(100),
      },
      address: {
        type: Sequelize.STRING(150),
      },
      neighborhood: {
        type: Sequelize.STRING(80),
      },
      zip_code: {
        type: Sequelize.STRING(10),
      },
      number: {
        type: Sequelize.STRING(10),
      },
      complement: {
        type: Sequelize.STRING(150),
      },
      observation: {
        type: Sequelize.TEXT,
      },
      birth_date: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable('customers');
  },
};
