const { Category } = require("../model/Category");

exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    const resposne = await category.save();
    res.status(201).json(resposne);
  } catch (err) {
    res.status(404).json(err);
  }
};


exports.fetchAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).exec();
    res.status(200).json(categories);
  } catch (error) {
    res.status(400).json(error);
  }
};
