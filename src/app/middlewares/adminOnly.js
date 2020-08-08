import User from '../models/User';

export default async (req, res, next) => {
  /**
   * Check user is administrator
   */
  const user = await User.findByPk(req.userId);

  if (!user.profile_admin) {
    return res
      .status(405)
      .json({ error: 'Action allowed for administrators only!' });
  }

  return next();
};
