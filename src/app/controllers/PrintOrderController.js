import Order from '../models/Order';
import Customer from '../models/Customer';
import OrderDetail from '../models/OrderDetail';
import OrderPayment from '../models/OrderPayment';
import OrderDetailStone from '../models/OrderDetailStone';
import User from '../models/User';
import Material from '../models/Material';
import PaymentType from '../models/PaymentType';
import FreightType from '../models/FreightType';
import Carrier from '../models/Carrier';
import Color from '../models/Color';
import Finishing from '../models/Finishing';

class PrintOrderController {
  async show(req, res) {
    const result = await Order.findOne({
      where: { id: req.params.id },
      include: [
        {
          model: Customer,
          as: 'customer',
          attributes: [
            'id',
            'name',
            'cpf',
            'birth_date',
            'phone',
            'cellphone',
            'email',
            'address',
            'neighborhood',
            'number',
            'complement',
            'state',
            'city',
            'zip_code',
          ],
        },
        {
          model: OrderDetail,
          as: 'order_details',
          include: [
            {
              model: OrderDetailStone,
              as: 'order_detail_stones',
              include: [
                {
                  model: Material,
                  as: 'material',
                  attributes: ['description'],
                },
              ],
            },
            {
              model: Color,
              as: 'color',
              attributes: ['description'],
            },
            {
              model: Finishing,
              as: 'finishing',
              attributes: ['description'],
            },
          ],
        },
        {
          model: OrderPayment,
          as: 'order_payments',
          include: [
            {
              model: PaymentType,
              as: 'payment_type',
              attributes: ['description'],
            },
          ],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: Carrier,
          as: 'delivery_carrier',
          attributes: ['name'],
        },
        {
          model: FreightType,
          as: 'delivery_freight_type',
          attributes: ['description'],
        },
      ],
    });

    if (!result)
      return res.status(404).json({ error: 'Registro não localizado.' });

    return res.json(result);
  }
}

export default new PrintOrderController();
