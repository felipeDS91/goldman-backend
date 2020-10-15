import jwt, { TokenExpiredError } from 'jsonwebtoken';
import { promisify } from 'util';
import * as Yup from 'yup';

import authConfig from '../../config/auth';
import AppError from '../errors/AppError';
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
      throw new AppError('Validation fails');
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new AppError('Usuário ou senha inválido', 401);
    }

    if (!(await user.checkPassword(password))) {
      throw new AppError('Usuário ou senha inválido', 401);
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
    // verifies if have a overdue token
    const authHeader = req.headers.authorization;
    if (!authHeader) throw new AppError('Token not provided', 401);

    const [, overdueToken] = authHeader.split(' ');

    try {
      await promisify(jwt.verify)(overdueToken, authConfig.secret);
    } catch (err) {
      if (!(err instanceof TokenExpiredError))
        throw new AppError('Invalid access', 401);
    }

    // generates new token
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
    } catch (e) {
      throw new AppError('Invalid access', 401);
    }
  }
}

export default new SessionController();
