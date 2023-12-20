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
require("dotenv").config();
const path = require("path");

// KEY

const SECRET_KEY = process.env.JWT_SECRET_KEY;

// JWT Options

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = SECRET_KEY;

// WEBHOOK
const endpointSecret = process.env.ENDPOINT_SECRET;

server.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      // console.log(err);
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        // console.log({ paymentIntentSucceeded });
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

// Middlewares

server.use(express.static(path.resolve(__dirname,"build")));
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
// server.use(express.raw({ type: "application/json" }));
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

// Payments

// This is your test secret API key.
const stripe = require("stripe")(process.env.STRIPE_SERVER_KEY);

server.post("/create-payment-intent", async (req, res) => {
  const { totalAmount } = req.body;

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount * 100,
    currency: "inr",
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
    automatic_payment_methods: {
      enabled: true,
    },
  });

  res.send({
    clientSecret: paymentIntent.client_secret,
  });
});

// DB Connection
main().catch((error) => console.log(error));
// Main ULR

// `mongodb+srv://rishi:rishi2002@cluster0.ualyzwa.mongodb.net/ecommerce`

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
  console.log("DB Connected");
}

server.listen(process.env.PORT, () => {
  console.log(`Server Listening at Port ${process.env.PORT}`);
});
