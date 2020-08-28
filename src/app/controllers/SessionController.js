import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import User from '../models/User';

const tokenList = {};

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails'});
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Usuário ou senha inválido' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Usuário ou senha inválido' });
    }

    const { id, name, provider } = user;

    const token = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.tokenLife,
    });

    const refreshToken = jwt.sign({ id }, authConfig.secret, {
      expiresIn: authConfig.refreshTokenLife,
    });

    const response = {
      user: {
        id,
        name,
        email,
        provider,
      },
      token,
      refreshToken,
    };

    tokenList[refreshToken] = response;

    return res.json(response);
  }

  async refresh(req, res) {

    const { refreshToken } = req.body;

    try {
      const decoded = await promisify(jwt.verify)(
        refreshToken,
        authConfig.secret
      );

      // if refresh token exists
      if (refreshToken && refreshToken in tokenList) {
        const newToken = jwt.sign({ id: decoded.id }, authConfig.secret, {
          expiresIn: authConfig.tokenLife,
        });

        // update the token in the list
        tokenList[refreshToken].token = newToken;

        return res.status(200).json({ token: newToken });
      }
    } catch {
      return res.status(401).send({ error: 'Invalid access' });  
    }

    return res.status(401).send({ error: 'Invalid access' });
  }
}

export default new SessionController();
