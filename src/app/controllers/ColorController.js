import * as Yup from 'yup';
import { Op } from 'sequelize';
import Color from '../models/Color';

const RES_PER_PAGE = 10;

class ColorController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const result = await Color.findAll({
      where: q && { descricao: { [Op.like]: `%${q}%` } },
      order: ['description'],
      limit: RES_PER_PAGE,
      offset: (page - 1) * RES_PER_PAGE,
    });

    // Count how many rows were found
    const resultCount = await Color.count({
      where: q && { descricao: { [Op.like]: `%${q}%` } },
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

    if (!result)
      return res
        .status(404)
        .json({ error: { message: 'Registro não localizado.' } });

    return res.json(result);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const result = await Color.create(req.body);

    return res.json(result);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string().required(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

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

    if (result === 0)
      return res
        .status(404)
        .json({ error: { message: 'Registro não localizado.' } });

    return res.status(200).send({
      message: `Registro ${req.params.id} deletado com sucesso`,
    });
  }
}

export default new ColorController();
