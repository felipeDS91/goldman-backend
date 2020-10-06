module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn('company', 'logo_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },

  down: queryInterface => {
    return queryInterface.removeColumn('company', 'logo_name');
  },
};
