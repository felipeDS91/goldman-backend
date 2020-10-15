import * as Yup from 'yup';
import AppError from '../errors/AppError';
import Company from '../models/Company';

class CompanyController {
  async show(req, res) {
    const result = await Company.findOne();

    if (!result) throw new AppError('Registro não localizado.', 404);

    return res.json(result);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required('Informe o nome.'),
      fantasy_name: Yup.string().required('Informe o nome fantasia.'),
      cnpj: Yup.string().required('Informe o CNPJ.'),
      phone: Yup.string(),
      cellphone: Yup.string(),
      email: Yup.string().email('Informe um email válido'),
      state: Yup.string(),
      city: Yup.string(),
      address: Yup.string(),
      neighborhood: Yup.string(),
      zip_code: Yup.string(),
      complement: Yup.string(),
    });

    await schema.validate(req.body, { abortEarly: false });

    const company = await Company.findOne();

    const result = company
      ? await Company.update(req.body, { where: { id: 1 } })
      : await Company.create(req.body);

    return res.json(result);
  }
}

export default new CompanyController();
