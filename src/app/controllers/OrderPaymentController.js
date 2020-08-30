import * as Yup from 'yup';
import OrderPayment from '../models/OrderPayment';

class OrderPaymentController {
  async show(req, res) {
    const result = await OrderPayment.findOne({
      where: { id_order: req.params.id },
    });

    if (!result)
      return res.status(404).json({ error: 'Registro não localizado.' });

    return res.json(result);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      id_order: Yup.number().required(),
      id_payment_type: Yup.number().required(),
      value: Yup.number().required(),
      payment_number: Yup.string(),
      due_date: Yup.date().required(),
      payment_date: Yup.date(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const result = await OrderPayment.create(req.body);

    return res.json(result);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      id_payment_type: Yup.number(),
      value: Yup.number().required(),
      payment_number: Yup.string(),
      due_date: Yup.date(),
      payment_date: Yup.date(),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const result = await OrderPayment.update(req.body);

    return res.json(result);
  }

  async delete(req, res) {
    const result = await OrderPayment.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (result === 0)
      return res.status(404).json({ error: 'Registro não localizado.' });

    return res.status(200).send();
  }
}

export default new OrderPaymentController();
