const express = require("express");
const server = express();
const mongoose = require("mongoose");
const productsRouter = require("./routes/Product");
const categoriesRouter = require("./routes/Category");
const brandRouters = require("./routes/Brand");
const userRouters = require("./routes/User");
const authRouters = require("./routes/Auth");
const cartRouters = require("./routes/Cart");
const orderRouters = require("./routes/Order");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
const { User } = require("./model/User");
const LocalStrategy = require("passport-local").Strategy;
const crypto = require("crypto");
const { isAuth, santizeUser, cookieExtractor } = require("./services/common");
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const cookieParser = require("cookie-parser");
// KEY

const SECRET_KEY = "SECRET_KEY";

// JWT Options

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;
// Middlewares

server.use(express.static("build"));
server.use(cookieParser());

server.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);
server.use(passport.authenticate("session"));
server.use(
  cors({
    exposedHeaders: ["X-Total-Count"],
  })
);
server.use(express.json());
server.use("/products", isAuth(), productsRouter.router);
server.use("/categories", isAuth(), categoriesRouter.router);
server.use("/brands", isAuth(), brandRouters.router);
server.use("/users", isAuth(), userRouters.router);
server.use("/auth", authRouters.router);
server.use("/cart", isAuth(), cartRouters.router);
server.use("/orders", isAuth(), orderRouters.router);

// Passport Strategies

passport.use(
  "local",
  new LocalStrategy({ usernameField: "email" }, async function (
    email,
    password,
    done
  ) {
    // by default passport uses username
    try {
      const user = await User.findOne({ email: email });
      // console.log(email, password, user);
      if (!user) {
        return done(null, false, { message: "invalid credentials" }); // for safety
      }
      crypto.pbkdf2(
        password,
        user.salt,
        310000,
        32,
        "sha256",
        async function (err, hashedPassword) {
          if (!crypto.timingSafeEqual(user.password, hashedPassword)) {
            return done(null, false, { message: "invalid credentials" });
          }
          const token = jwt.sign(santizeUser(user), SECRET_KEY);
          done(null, { token }); // this lines sends to serializer
        }
      );
    } catch (err) {
      done(err);
    }
  })
);

passport.use(
  "jwt",
  new JwtStrategy(opts, async function (jwt_payload, done) {
    // console.log({ jwt_payload });
    try {
      const user = await User.findById(jwt_payload.id);
      // console.log({user});
      if (user) {
        // console.log("Found", {user});
        return done(null, santizeUser(user)); // this calls serializer
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

// to create sessions variables
passport.serializeUser(function (user, cb) {
  // console.log("serialize", user);
  process.nextTick(function () {
    return cb(null, {
      id: user.id,
      role: user.role,
      addresses: user.addresses,
      name: user.name,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  // console.log("de-serialize", user);
  process.nextTick(function () {
    return cb(null, user);
  });
});

////

// DB Connection
main().catch((error) => console.log(error));
// Main ULR

// `mongodb+srv://rishi:rishi2002@cluster0.ualyzwa.mongodb.net/ecommerce`

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/test");
  console.log("DB Connected");
}

server.listen(8080, () => {
  console.log("Server Listening at Port 8080");
});
