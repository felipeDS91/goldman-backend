import * as Yup from 'yup';
import { Op } from 'sequelize';
import Order from '../models/Order';
import Customer from '../models/Customer';
import OrderDetail from '../models/OrderDetail';
import OrderPayment from '../models/OrderPayment';
import OrderDetailStone from '../models/OrderDetailStone';
import Status from '../models/Status';
import User from '../models/User';

const RES_PER_PAGE = 10;

const schema = Yup.object().shape({
  id_user: Yup.number().nullable(),
  id_customer: Yup.number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required('Informe o cliente.'),
  id_status: Yup.number()
    .transform(value => (Number.isNaN(value) ? undefined : value))
    .required('Informe o status.'),
  delivery_forecast: Yup.date(),
  delivery_date: Yup.date(),
  total: Yup.number()
    .min(1, 'Valor inválido.')
    .required('Informe o total.'),
  grams_used: Yup.number()
    .transform(value => (Number.isNaN(value) ? null : value))
    .nullable(),
  delivery_type: Yup.string().required('Informe o tipo de envio.'),
  delivery_value: Yup.number().when('delivery_type', (delivery_type, field) =>
    delivery_type === 'transportadora' || delivery_type === 'motoboy'
      ? field
          .transform(value => (Number.isNaN(value) ? undefined : value))
          .required('Informe o valor.')
      : field
  ),
  delivery_id_carrier: Yup.number().when(
    'delivery_type',
    (delivery_type, field) =>
      delivery_type === 'transportadora'
        ? field
            .transform(value => (Number.isNaN(value) ? undefined : value))
            .required('Informe a transportadora.')
        : field
  ),
  delivery_id_freight_type: Yup.number().when(
    'delivery_type',
    (delivery_type, field) =>
      delivery_type === 'transportadora'
        ? field
            .transform(value => (Number.isNaN(value) ? undefined : value))
            .required('Informe o tipo de frete.')
        : field
  ),
  delivery_zip_code: Yup.string().when(
    'delivery_type',
    (delivery_type, field) =>
      delivery_type === 'transportadora' || delivery_type === 'motoboy'
        ? field.required('Informe o cep.')
        : field
  ),
  delivery_state: Yup.string().when('delivery_type', (delivery_type, field) =>
    delivery_type === 'transportadora' || delivery_type === 'motoboy'
      ? field.required('Informe o estado.')
      : field
  ),
  delivery_city: Yup.string().when('delivery_type', (delivery_type, field) =>
    delivery_type === 'transportadora' || delivery_type === 'motoboy'
      ? field.required('Informe a cidade.')
      : field
  ),
  delivery_neighborhood: Yup.string().when(
    'delivery_type',
    (delivery_type, field) =>
      delivery_type === 'transportadora' || delivery_type === 'motoboy'
        ? field.required('Informe o bairro.')
        : field
  ),
  delivery_address: Yup.string().when('delivery_type', (delivery_type, field) =>
    delivery_type === 'transportadora' || delivery_type === 'motoboy'
      ? field.required('Informe o endereço.')
      : field
  ),
  delivery_number: Yup.string().when('delivery_type', (delivery_type, field) =>
    delivery_type === 'transportadora' || delivery_type === 'motoboy'
      ? field.required('Informe o número.')
      : field
  ),
  delivery_complement: Yup.string().when(
    'delivery_type',
    (delivery_type, field) =>
      delivery_type === 'transportadora' || delivery_type === 'motoboy'
        ? field.required('Informe o complemento.')
        : field
  ),

  order_details: Yup.array().of(
    Yup.object().shape({
      item_type: Yup.string().required('Informe o tipo de jóia.'),
      value: Yup.number()
        .min(1, 'Valor inválido.')
        .required('Informe o valor.'),
      observation: Yup.string(),

      /**
       * Other validation
       */
      description: Yup.string().when('item_type', (item_type, field) =>
        item_type === 'outros' ? field.required('Informe a descrição.') : field
      ),
      amount: Yup.number().when('item_type', (item_type, field) =>
        item_type === 'outros'
          ? field
              .transform(value => (Number.isNaN(value) ? undefined : value))
              .min(1, 'Quantidade inválida.')
              .required('Informe a quantidade.')
          : field
      ),

      /**
       * Aliannce validation
       */
      ring_size_2: Yup.string(),
      recording_1: Yup.string(),
      recording_2: Yup.string(),
      id_finishing: Yup.number()
        .transform(value => (Number.isNaN(value) ? null : value))
        .when('item_type', (item_type, field) =>
          item_type === 'alianca'
            ? field.required('Informe o acabamento.')
            : field.nullable()
        ),
      width: Yup.number().when('item_type', (item_type, field) =>
        item_type === 'alianca'
          ? field
              .transform(value => (Number.isNaN(value) ? undefined : value))
              .min(3, 'Largura inválida.')
              .max(12, 'Largura inválida.')
              .required('Informe a largura.')
          : field
      ),
      weight: Yup.number().when('item_type', (item_type, field) =>
        item_type === 'alianca'
          ? field
              .transform(value => (Number.isNaN(value) ? undefined : value))
              .required('Informe o peso.')
          : field
      ),

      /**
       * Rings and Alliances validation
       */
      ring_size_1: Yup.number().when('item_type', (item_type, field) =>
        item_type === 'anel' || item_type === 'alianca'
          ? field
              .transform(value => (Number.isNaN(value) ? undefined : value))
              .min(8, 'Tamanho inválido.')
              .max(35, 'Tamanho inválido.')
              .required('Informe o tamanho.')
          : field
      ),
      id_color: Yup.number()
        .transform(value => (Number.isNaN(value) ? null : value))
        .when('item_type', (item_type, field) =>
          item_type === 'anel' || item_type === 'alianca'
            ? field.required('Informe a cor.')
            : field.nullable()
        ),
      order_detail_stones: Yup.array().when('item_type', (item_type, field) =>
        item_type === 'anel' || item_type === 'alianca'
          ? field.of(
              Yup.object().shape({
                amount: Yup.number()
                  .transform(value => (Number.isNaN(value) ? undefined : value))
                  .min(1, 'Quantidade inválida.')
                  .required('Informe a quantidade.'),
                points: Yup.number()
                  .transform(value => (Number.isNaN(value) ? undefined : value))
                  .min(1, 'Tamanho inválido.')
                  .required('Informe o tamanho.'),
                id_material: Yup.number()
                  .transform(value => (Number.isNaN(value) ? undefined : value))
                  .required('Informe o material.'),
              })
            )
          : field
      ),
    })
  ),

  order_payments: Yup.array().of(
    Yup.object().shape({
      id_payment_type: Yup.number()
        .transform(value => (Number.isNaN(value) ? undefined : value))
        .required('Informe o tipo de pagamento.'),
      value: Yup.number()
        .min(0.1, 'Valor inválido.')
        .required('Informe o valor.'),
      date: Yup.date().required('Informe a data.'),
    })
  ),
});

class OrderController {
  async index(req, res) {
    const { page = 1, q } = req.query;

    const result = await Order.findAll({
      where: q && { id: { [Op.like]: `%${q}%` } },
      order: [['id', 'DESC']],
      limit: RES_PER_PAGE,
      offset: (page - 1) * RES_PER_PAGE,
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['name'],
        },
        {
          model: Status,
          as: 'status',
          attributes: ['description'],
        },
      ],
    });

    // Count how many rows were found
    const resultCount = await Order.count({
      where: q && { id: { [Op.like]: `%${q}%` } },
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
    const result = await Order.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: ['id', 'name'],
        },
        {
          model: OrderDetail,
          as: 'order_details',
          include: [
            {
              model: OrderDetailStone,
              as: 'order_detail_stones',
            },
          ],
        },
        {
          model: OrderPayment,
          as: 'order_payments',
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (!result)
      return res
        .status(404)
        .json({ error: { message: 'Registro não localizado.' } });

    return res.json(result);
  }

  async store(req, res) {
    let validatedData;

    try {
      validatedData = await schema.validate(req.body, {
        abortEarly: false,
      });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const { order_details, order_payments, ...order } = validatedData;

    const result = await Order.create(order);

    await Promise.all(
      order_details.map(async detail => {
        const detailResult = await OrderDetail.create({
          ...detail,
          id_order: result.id,
        });

        const { order_detail_stones } = detail;

        if (order_detail_stones) {
          await Promise.all(
            order_detail_stones.map(async stone => {
              await OrderDetailStone.create({
                ...stone,
                id_order_detail: detailResult.id,
              });
            })
          );
        }
      })
    );

    await Promise.all(
      order_payments.map(async payment => {
        await OrderPayment.create({ ...payment, id_order: result.id });
      })
    );

    return res.json(result);
  }

  async update(req, res) {
    let validatedData;

    try {
      validatedData = await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const { order_details, order_payments, ...order } = validatedData;

    const result = await Order.update(order, {
      where: { id: req.params.id },
    });

    /**
     * First, erase all data children from details and payments
     */
    await OrderDetail.destroy({
      where: {
        id_order: req.params.id,
      },
    });

    await OrderPayment.destroy({
      where: {
        id_order: req.params.id,
      },
    });

    /**
     * Then creates all of them again
     */
    await Promise.all(
      order_details.map(async detail => {
        const detailResult = await OrderDetail.create({
          ...detail,
          id_order: req.params.id,
        });

        const { order_detail_stones } = detail;

        if (order_detail_stones) {
          await Promise.all(
            order_detail_stones.map(async stone => {
              await OrderDetailStone.create({
                ...stone,
                id_order_detail: detailResult.id,
              });
            })
          );
        }
      })
    );

    await Promise.all(
      order_payments.map(async payment => {
        await OrderPayment.create({ ...payment, id_order: req.params.id });
      })
    );

    return res.json(result);
  }

  async delete(req, res) {
    const result = await Order.destroy({
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

export default new OrderController();
