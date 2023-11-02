const { Product } = require("../model/Product");
exports.createProduct = async (req, res) => {
  const product = new Product(req.body);
  try{
    const resposne = await product.save();
    res.status(201).json(resposne);
  }
  catch(err){
    res.status(404).json(err);
  }
};
