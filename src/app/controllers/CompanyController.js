import * as Yup from 'yup';
import Company from '../models/Company';

class CompanyController {
  async show(req, res) {
    const result = await Company.findOne();

    if (!result)
      return res.status(404).json({ error: 'Registro não localizado.' });

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

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const company = await Company.findOne();

    const result = company
      ? await Company.update(req.body, { where: { id: 1 } })
      : await Company.create(req.body);

    return res.json(result);
  }
}

export default new CompanyController();
