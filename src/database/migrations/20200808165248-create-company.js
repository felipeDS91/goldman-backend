module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('company', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fantasy_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cnpj: {
        type: Sequelize.STRING(14),
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
      instagram: {
        type: Sequelize.STRING(150),
      },
      facebook: {
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
    return queryInterface.dropTable('company');
  },
};
