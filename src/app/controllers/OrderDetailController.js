import * as Yup from 'yup';
import OrderDetail from '../models/OrderDetail';

class OrderDetailController {
  async show(req, res) {
    const result = await OrderDetail.findOne({
      where: { id_order: req.params.id },
    });

    if (!result)
      return res.status(404).json({ error: 'Registro não localizado.' });

    return res.json(result);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id_order: Yup.number().required(),
      description: Yup.string(),
      value: Yup.number().required(),
      amount: Yup.number(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const result = await OrderDetail.create(req.body);

    return res.json(result);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      description: Yup.string(),
      value: Yup.number(),
      amount: Yup.number(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const result = await OrderDetail.update(req.body);

    return res.json(result);
  }

  async delete(req, res) {
    const result = await OrderDetail.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (result === 0)
      return res.status(404).json({ error: 'Registro não localizado.' });

    return res.status(200).send();
  }
}

export default new OrderDetailController();
