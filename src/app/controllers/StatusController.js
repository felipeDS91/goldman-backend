import * as Yup from 'yup';
import { Op } from 'sequelize';
import Status from '../models/Status';

const RES_PER_PAGE = 10;

class StatusController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const result = await Status.findAll({
      where: q && { description: { [Op.like]: `%${q}%` } },
      order: ['description'],
      limit: RES_PER_PAGE,
      offset: (page - 1) * RES_PER_PAGE,
    });

    // Count how many rows were found
    const resultCount = await Status.count({
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
    const result = await Status.findOne({
      where: { id: req.params.id },
    });

    if (!result)
      return res.status(404).json({ error: 'Registro não localizado.' });

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

    const result = await Status.create(req.body);

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

    const result = await Status.update(req.body, {
      where: { id: req.params.id },
    });

    return res.json(result);
  }

  async delete(req, res) {
    const result = await Status.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (result === 0)
      return res.status(404).json({ error: 'Registro não localizado.' });

    return res.status(200).send();
  }
}

export default new StatusController();
