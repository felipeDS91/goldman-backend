import Sequelize, { Model } from 'sequelize';

class Company extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        fantasy_name: Sequelize.STRING,
        cnpj: Sequelize.STRING,
        phone: Sequelize.STRING,
        cellphone: Sequelize.STRING,
        email: Sequelize.STRING,
        instagram: Sequelize.STRING,
        facebook: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        address: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
        zip_code: Sequelize.STRING,
        complement: Sequelize.STRING,
        number: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'company',
      }
    );

    return this;
  }
}

export default Company;
