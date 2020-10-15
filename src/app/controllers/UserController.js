import * as Yup from 'yup';
import { Op } from 'sequelize';
import User from '../models/User';
import AppError from '../errors/AppError';
import ValidationError from '../errors/ValidationError';

const RES_PER_PAGE = 10;

class UserController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const result = await User.findAll({
      where: q && { name: { [Op.like]: `%${q}%` } },
      order: ['name'],
      limit: RES_PER_PAGE,
      offset: (page - 1) * RES_PER_PAGE,
    });

    // Count how many rows were found
    const resultCount = await User.count({
      where: q && { name: { [Op.like]: `%${q}%` } },
    });
    const totalPages = Math.ceil(resultCount / RES_PER_PAGE);

    return res.json({
      docs: result,
      total: resultCount,
      limit: RES_PER_PAGE,
      page: Number(page),
      pages: totalPages,
    });
  }

  async show(req, res) {
    const result = await User.findOne({
      where: { id: req.params.id },
    });

    if (!result) throw new AppError('Registro não localizado.', 404);

    return res.json(result);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('Informe o nome.'),
      email: Yup.string()
        .required('Informe o email.')
        .email('Email inválido.'),
      password: Yup.string()
        .required('Informe a senha.')
        .min(6, 'Senha deve ter ao mínimo 6 caracteres.'),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password
          ? field
              .required('Informe a confirmação da senha')
              .oneOf([Yup.ref('password')])
          : field
      ),
      profile_admin: Yup.boolean(),
    });

    await schema.validate(req.body, { abortEarly: false });

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      throw new AppError('Email cadastrado para esse usuário já existe');
    }

    const { id, name, email } = await User.create(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email('Email inválido.'),
      password: Yup.string()
        .transform(v => (v === '' ? null : v))
        .nullable()
        .min(6, 'Senha deve ter ao mínimo 6 caracteres.'),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password
          ? field
              .required('Informe a confirmação da senha')
              .oneOf([Yup.ref('password')], 'As senhas não conferem.')
          : field
      ),
      profile_admin: Yup.boolean(),
    });

    await schema.validate(req.body, { abortEarly: false });

    const { email } = req.body;

    const user = await User.findByPk(req.params.id);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists)
        throw new ValidationError([
          { message: 'Email cadastrado para esse usuário já existe.' },
        ]);
    }

    const { id, name } = await user.update(req.body);

    return res.json({
      id,
      name,
      email,
    });
  }

  async delete(req, res) {
    const result = await User.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (result === 0) throw new AppError('Registro não localizado.', 404);

    return res.status(200).send();
  }
}

export default new UserController();
