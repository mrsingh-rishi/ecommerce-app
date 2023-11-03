const { Brand } = require("../model/Brand");

exports.createBrand = async (req, res) => {
  const brand = new Brand(req.body);
  try {
    const resposne = await brand.save();
    res.status(201).json(resposne);
  } catch (err) {
    res.status(404).json(err);
  }
};

exports.fetchAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find({}).exec();
    res.status(200).json(brands);
  } catch (error) {
    res.status(400).json(error);
  }
};
