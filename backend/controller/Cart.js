const { Cart } = require("../model/Cart");

exports.addToCart = async (req, res) => {
  const cart = new Cart(req.body);
  try {
    const doc = await cart.save();
    const result = await doc.populate("product");
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.fetchCartByUser = async (req, res) => {
  const { id } = req.params;
  try {
    const cartItems = await Cart.find({ user: id }).populate("product");
    res.status(200).json(cartItems);
  } catch (error) {
    res.status(404).json(error);
  }
};

exports.deleteFromCart = async (req, res) => {
  const { id } = req.params;
  try {
    const doc = await Cart.findOneAndDelete({ product: id });
    res.status(200).json(doc);
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.updateCart = async (req, res) => {
  const { id } = req.params;

  try {
    const cart = await Cart.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(cart);
  } catch (err) {
    res.status(404).json(err);
  }
};
