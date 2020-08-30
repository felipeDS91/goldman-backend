import * as Yup from 'yup';
import User from '../models/User';

class ChangePasswordController {
  async update(req, res) {
    const schema = Yup.object().shape({
      password: Yup.string()
        .required('Informe a senha.')
        .min(6, 'Senha deve ter ao mínimo 6 caracteres.'),
      confirmPassword: Yup.string()
        .required('Informe a confirmação da senha.')
        .oneOf([Yup.ref('password')], 'As senhas não conferem.'),
      oldPassword: Yup.string().required('Informe a senha antiga.'),
    });

    try {
      await schema.validate(req.body, { abortEarly: false });
    } catch (err) {
      return res
        .status(400)
        .json({ error: 'Validation fails', messages: err.inner });
    }

    const { oldPassword } = req.body;

    const user = await User.findByPk(req.userId);

    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(400).json({
        error: 'Validation fails',
        messages: [{ message: 'Senha atual inválida.' }],
      });
    }

    const { id, name, password } = await user.update(req.body);

    return res.json({
      id,
      name,
      password,
    });
  }
}

export default new ChangePasswordController();
