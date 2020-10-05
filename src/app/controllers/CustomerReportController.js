import { Op, fn, col, where } from 'sequelize';
import Customer from '../models/Customer';

class CustomersReportController {
  async index(req, res) {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};

    const filters = [];

    if (filter.register_initial_date)
      filters.push({ created_at: { [Op.gt]: filter.register_initial_date } });

    if (filter.register_final_date)
      filters.push({ created_at: { [Op.lt]: filter.register_final_date } });

    if (filter.city && filter.city.length > 0)
      filters.push({ city: { [Op.in]: filter.city } });

    if (filter.birthday_month && filter.birthday_month.length > 0)
      filters.push(
        where(fn('MONTH', col(`birth_date`)), filter.birthday_month)
      );

    if (filter.birthday_day && Number(filter.birthday_day))
      filters.push(where(fn('DAY', col(`birth_date`)), filter.birthday_day));

    const result = await Customer.findAll({
      where: filters,
      order: ['name'],
    });

    return res.json(result);
  }
}

export default new CustomersReportController();
