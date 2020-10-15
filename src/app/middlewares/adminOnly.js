import AppError from '../errors/AppError';
import User from '../models/User';

export default async (req, res, next) => {
  /**
   * Check user is administrator
   */
  const user = await User.findByPk(req.userId);

  if (!user.profile_admin) {
    throw new AppError('Action allowed for administrators only!', 405);
  }

  return next();
};
