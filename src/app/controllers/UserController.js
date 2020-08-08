import * as Yup from 'yup';
import { Op } from 'sequelize';
import User from '../models/User';

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

    if (!result)
      return res
        .status(404)
        .json({ error: { message: 'Registro não localizado.' } });

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

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res
        .status(400)
        .json({ error: 'Email cadastrado para esse usuário já existe' });
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
      name: Yup.string().required('Informe o nome.'),
      email: Yup.string()
        .required('Informe o email.')
        .email('Email inválido.'),
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

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const { email } = req.body;

    const user = await User.findByPk(req.params.id);

    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });

      if (userExists) {
        return res.status(400).json({
          error: 'Validation fails',
          messages: [
            { message: 'Email cadastrado para esse usuário já existe.' },
          ],
        });
      }
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

    if (result === 0)
      return res
        .status(404)
        .json({ error: { message: 'Registro não localizado.' } });

    return res.status(200).send({
      message: `Registro ${req.params.id} deletado com sucesso`,
    });
  }
}

export default new UserController();
