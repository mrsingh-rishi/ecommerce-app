const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  email: { type: String, require: true, unique: true },
  password: { type: Buffer, require: true },
  role: {
    type: String,
    require: true,
    default: "user",
  },
  addresses: {
    type: [Schema.Types.Mixed],
  },
  name: { type: String },
  orders: {
    type: [Schema.Types.Mixed],
  },
  salt: Buffer
});

const virtual = userSchema.virtual("id");

virtual.get(function () {
  return this._id;
});

userSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

exports.User = mongoose.model("User", userSchema);
