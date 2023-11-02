const express = require("express");
const server = express();
const mongoose = require("mongoose");
const productsRouter = require('./routes/Product');
// Middlewares

server.use(express.json());
server.use('/products', productsRouter.router);
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
