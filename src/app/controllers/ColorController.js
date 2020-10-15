import * as Yup from 'yup';
import { Op } from 'sequelize';
import Color from '../models/Color';
import AppError from '../errors/AppError';

const RES_PER_PAGE = 10;

class ColorController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const result = await Color.findAll({
      where: q && { description: { [Op.like]: `%${q}%` } },
      order: ['description'],
      limit: RES_PER_PAGE,
      offset: (page - 1) * RES_PER_PAGE,
    });

    // Count how many rows were found
    const resultCount = await Color.count({
      where: q && { description: { [Op.like]: `%${q}%` } },
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
    const result = await Color.findOne({
      where: { id: req.params.id },
    });

    if (!result) throw new AppError('Registro não localizado.', 404);

    return res.json(result);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    const result = await Color.create(req.body);

    return res.json(result);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    await schema.validate(req.body, { abortEarly: false });

    const result = await Color.update(req.body, {
      where: { id: req.params.id },
    });

    return res.json(result);
  }

  async delete(req, res) {
    const result = await Color.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (result === 0) throw new AppError('Registro não localizado.', 404);

    return res.status(200).send();
  }
}

export default new ColorController();
