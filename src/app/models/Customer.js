import Sequelize, { Model } from 'sequelize';

class Customer extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,

        cpf: {
          type: Sequelize.STRING,
          allowNull: false,
          notEmpty: true,
          unique: {
            args: 'cpf',
            msg: 'CPF já cadastrado!',
          },
        },

        phone: Sequelize.STRING,
        cellphone: Sequelize.STRING,
        email: Sequelize.STRING,
        state: Sequelize.STRING,
        city: Sequelize.STRING,
        address: Sequelize.STRING,
        neighborhood: Sequelize.STRING,
        zip_code: Sequelize.STRING,
        complement: Sequelize.STRING,
        number: Sequelize.STRING,
        birth_date: Sequelize.DATE,
        observation: Sequelize.TEXT,
      },
      {
        sequelize,
      }
    );

    return this;
  }
}

export default Customer;
