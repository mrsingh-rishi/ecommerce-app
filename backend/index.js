const express = require("express");
const server = express();
const mongoose = require("mongoose");
const productsRouter = require('./routes/Product');
const categoriesRouter = require('./routes/Category');
const brandRouters = require('./routes/Brand');
const userRouters = require('./routes/User');
const authRouters = require('./routes/Auth');
const cartRouters = require('./routes/Cart');
const orderRouters = require('./routes/Order');



const cors = require('cors');
// Middlewares

server.use(cors({
  exposedHeaders: ['X-Total-Count']
}));
server.use(express.json());
server.use('/products', productsRouter.router);
server.use('/categories', categoriesRouter.router);
server.use('/brands', brandRouters.router);
server.use('/users', userRouters.router);
server.use('/auth', authRouters.router);
server.use('/cart', cartRouters.router);
server.use('/orders', orderRouters.router);





// DB Connection
main().catch((error) => console.log(error));
// Main ULR
// `mongodb+srv://rishi:rishi2002@cluster0.ualyzwa.mongodb.net/ecommerce`

async function main() {
  await mongoose.connect(
    'mongodb://127.0.0.1:27017/test'
  );
  console.log("DB Connected");
}

server.get("/", (req, res) => {
  res.json({ status: "success" });
});


server.listen(8080, () => {
  console.log("Server Listening at Port 8080");
});
