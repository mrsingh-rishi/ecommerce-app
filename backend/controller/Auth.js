const { User } = require("../model/User");

exports.createUser = async (req, res) => {
  const user = new User(req.body);
  try {
    const resposne = await user.save();
    res.status(201).json(resposne);
  } catch (err) {
    res.status(404).json(err);
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user)
      res.status(401).json({ message: "no such user with that email" });
    else if (user.password === req.body.password)
      res.status(201).json({
        id: user.id,
        email: user.email,
        addresses: user.addresses,
        orders: user.orders,
        role: user.role,
      });
    else res.status(401).json({ message: "invalid credentials" });
  } catch (error) {
    res.status(400).json(error);
  }
};
