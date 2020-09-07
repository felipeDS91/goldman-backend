import { fn, col, Op } from 'sequelize';
import Order from '../models/Order';
import OrderDetail from '../models/OrderDetail';

class ChartOrderController {
  async index(req, res) {
    const { q } = req.query;

    const result = await Order.findAll({
      raw: true,
      include: [
        {
          model: OrderDetail,
          as: 'order_details',
          attributes: [],
          where: q && { item_type: { [Op.or]: q } },
        },
      ],
      attributes: [
        ['created_at', 'date'],
        [fn('SUM', col(`value`)), 'value'],
      ],
      group: [fn('DATE', col(`Order.created_at`))],
    });

    return res.json(result);
  }
}

export default new ChartOrderController();
