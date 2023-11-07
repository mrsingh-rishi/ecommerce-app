const { User } = require("../model/User");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "SECRET_KEY";

const crypto = require("crypto");
const { santizeUser } = require("../services/common");
exports.createUser = async (req, res) => {
  try {
    const salt = crypto.randomBytes(16);
    crypto.pbkdf2(
      req.body.password,
      salt,
      310000,
      32,
      "sha256",
      async function (err, hashedPassword) {
        const user = new User({ ...req.body, password: hashedPassword, salt });
        const doc = await user.save();

        req.login(santizeUser(doc), (err) => {
          // this also calls serializer and adds to session
          if (err) {
            res.status(400).json(err);
          } else {
            const token = jwt.sign(santizeUser(doc), SECRET_KEY);
            res
              .cookie("jwt", {
                expires: new Date(Date.now() + 3600000),
                httpOnly: true,
              })
              .status(201)
              .json(token);
          }
        });
      }
    );
  } catch (err) {
    res.status(400).json(err);
  }
};

exports.loginUser = async (req, res) => {
  res
    .cookie("jwt", req.user.token, {
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    })
    .status(201)
    .json(req.user.token);
};

exports.checkUser = (req, res) => {
  if (req.user) {
    res.json({ status: "success", user: req.user });
  } else {
    res.sendStatus(404);
  }
};
