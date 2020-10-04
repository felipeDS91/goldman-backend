import { Op } from 'sequelize';
import Order from '../models/Order';
import Customer from '../models/Customer';
import OrderDetail from '../models/OrderDetail';
import OrderPayment from '../models/OrderPayment';
import Status from '../models/Status';
import User from '../models/User';

class OrderReportController {
  async index(req, res) {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};

    const filters = [];

    if (filter.id_customer && filter.id_customer !== '')
      filters.push({ id_customer: filter.id_customer });

    if (filter.id_user && filter.id_user.length > 0)
      filters.push({ '$user.id$': { [Op.in]: filter.id_user } });

    if (filter.delivery_type && filter.delivery_type.length > 0)
      filters.push({ delivery_type: { [Op.in]: filter.delivery_type } });

    if (filter.id_status && filter.id_status.length > 0)
      filters.push({ '$status.id$': { [Op.in]: filter.id_status } });

    if (typeof filter.paid !== 'undefined' && filter.paid !== '')
      filters.push({ paid: filter.paid });

    if (filter.id_payment_type && filter.id_payment_type.length > 0)
      filters.push({
        '$order_payments.id_payment_type$': { [Op.in]: filter.id_payment_type },
      });

    if (filter.type && filter.type.length > 0)
      filters.push({ '$order_details.item_type$': { [Op.in]: filter.type } });

    if (Number(filter.total_initial_value))
      filters.push({ total: { [Op.gt]: filter.total_initial_value } });

    if (Number(filter.total_final_value))
      filters.push({ total: { [Op.lt]: filter.total_final_value } });

    if (filter.observation && filter.observation !== '')
      filters.push({ observation: { [Op.like]: filter.observation } });

    if (filter.order_initial_date)
      filters.push({ created_at: { [Op.gt]: filter.order_initial_date } });

    if (filter.order_final_date)
      filters.push({ created_at: { [Op.lt]: filter.order_final_date } });

    if (filter.delivery_initial_date)
      filters.push({
        delivery_date: { [Op.gt]: filter.delivery_initial_date },
      });

    if (filter.delivery_final_date)
      filters.push({ delivery_date: { [Op.lt]: filter.delivery_final_date } });

    const result = await Order.findAll({
      where: filters,
      order: [['id', 'DESC']],
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
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
        {
          model: OrderPayment,
          as: 'order_payments',
          attributes: [],
        },
        {
          model: OrderDetail,
          as: 'order_details',
          attributes: [],
        },
      ],
    });

    return res.json(result);
  }
}

export default new OrderReportController();
