const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
require("./Connection/Connection");
const router = require("./Routes/user");
const routers = require("./Routes/Book");
const routes = require("./Routes/Favourites");
const cart = require("./Routes/Cart");
const orders = require("./Routes/order");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Apply CORS middleware

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/", router);
app.use("/book", routers);
app.use("/favourites", routes);
app.use("/Cart", cart);
app.use("/order", orders);

app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server is Connected PORT : ${process.env.PORT}`);
});
