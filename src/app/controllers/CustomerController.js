import * as Yup from 'yup';
import { Op } from 'sequelize';
import Customer from '../models/Customer';
import { isValidCPF } from '../utils/validations';

const RES_PER_PAGE = 10;

class CustomerController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const result = await Customer.findAll({
      where: q && { name: { [Op.like]: `%${q}%` } },
      order: ['name'],
      limit: RES_PER_PAGE,
      offset: (page - 1) * RES_PER_PAGE,
    });

    // Count how many rows were found
    const resultCount = await Customer.count({
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
    const result = await Customer.findOne({
      where: { id: req.params.id },
    });

    if (!result)
      return res.status(404).json({ error: 'Registro não localizado.' });

    return res.json(result);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('Informe o nome'),
      cpf: Yup.string().test('cpf', 'CPF inválido.', value =>
        isValidCPF(value)
      ),
      phone: Yup.string(),
      cellphone: Yup.string(),
      email: Yup.string().email('Informe um email válido.'),
      state: Yup.string(),
      city: Yup.string(),
      address: Yup.string(),
      neighborhood: Yup.string(),
      zip_code: Yup.string(),
      complement: Yup.string(),
      number: Yup.string(),
      birth_date: Yup.date().nullable(),
      observation: Yup.string(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const result = await Customer.create(req.body);

    return res.json(result);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      cpf: Yup.string(),
      phone: Yup.string(),
      cellphone: Yup.string(),
      email: Yup.string().email('Informe um email válido'),
      state: Yup.string(),
      city: Yup.string(),
      address: Yup.string(),
      neighborhood: Yup.string(),
      zip_code: Yup.string(),
      complement: Yup.string(),
      birth_date: Yup.date(),
      observation: Yup.string(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const user = await Customer.findByPk(req.params.id);

    const result = await user.update(req.body);

    return res.json(result);
  }

  async delete(req, res) {
    const result = await Customer.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (result === 0)
      return res.status(404).json({ error: 'Registro não localizado.' });

    return res.status(200).send();
  }
}

export default new CustomerController();
