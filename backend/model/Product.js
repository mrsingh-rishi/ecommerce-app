const mongoose = require("mongoose");

const { Schema } = mongoose;

const productSchema = new Schema({
  title: { type: String, require: true, unique: true },
  description: { type: String, require: true },
  price: {
    type: Number,
    require: true,
    min: [0, "wrong minimun price"],
    max: [10000000, "wrong max value"],
  },
  discountPercentage: {
    type: Number,
    default: 0,
    min: [0, "wrong minimun dicount"],
    max: [45, "wrong maximum dicount"],
  },
  rating: {
    type: Number,
    default: 0,
    min: [0, "wrong minimun rating"],
    max: [5, "wrong maximum rating"],
  },
  stock: {
    type: Number,
    require: true,
    min: [0, "wrong minimun stocks"],
  },
  brand: { type: String, require: true },
  category: { type: String, require: true },
  thumbnail: { type: String, require: true },
  images: { type: [String], require: true },
  deleted: { type: Boolean, default: false },
});

const virtual = productSchema.virtual('id');

virtual.get(function(){
  return this._id;
})

productSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {delete ret._id}
})

exports.Product = mongoose.model("Product", productSchema);
