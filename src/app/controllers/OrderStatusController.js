import * as Yup from 'yup';
import OrderStatus from '../models/OrderStatus';

class OrderStatusController {
  async show(req, res) {
    const result = await OrderStatus.findOne({
      where: { id_order: req.params.id },
    });

    if (!result)
      return res
        .status(404)
        .json({ error: { message: 'Registro não localizado.' } });

    return res.json(result);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id_order: Yup.number().required(),
      id_status: Yup.number().required(),
      date: Yup.date(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const result = await OrderStatus.create(req.body);

    return res.json(result);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id_order: Yup.number(),
      id_status: Yup.number().required(),
      date: Yup.date(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const result = await OrderStatus.update(req.body);

    return res.json(result);
  }

  async delete(req, res) {
    const result = await OrderStatus.destroy({
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

export default new OrderStatusController();
