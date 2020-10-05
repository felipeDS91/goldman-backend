import Customer from '../models/Customer';

class CitiesController {
  async index(req, res) {
    const result = await Customer.findAll({
      order: ['city'],
      group: ['city'],
      attributes: ['city'],
    });

    return res.json(result);
  }
}

export default new CitiesController();
