import jwt from 'jsonwebtoken';
import authConfig from '../../src/config/auth';

export default function auth(idUser = 1) {
  return jwt.sign({ id: idUser }, authConfig.secret, {
    expiresIn: authConfig.refreshTokenLife,
  });
}
