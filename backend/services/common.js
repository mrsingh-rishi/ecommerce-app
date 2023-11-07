const passport = require("passport");

exports.isAuth = (req, res, done) => {
  return passport.authenticate('jwt');
};

exports.santizeUser = (user) => {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    addresses: user.addresses,
  };
};
