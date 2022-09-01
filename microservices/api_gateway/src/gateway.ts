const path = require("path");
require("dotenv").config({
  path: path.join(__dirname, `../env/${process.env.NODE_ENV}.env`),
});

import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const authProxy = createProxyMiddleware({
  target: `${process.env.AUTH_TARGET}`,
  changeOrigin: true,
  pathRewrite: {
    [`^/auth`]: "",
  },
});

const productsProxy = createProxyMiddleware({
  target: `${process.env.PRODUCTS_TARGET}`,
  changeOrigin: true,
  pathRewrite: {
    [`^/products`]: "",
  },
});

const ordersProxy = createProxyMiddleware({
  target: `${process.env.ORDERS_TARGET}`,
  changeOrigin: true,
  pathRewrite: {
    [`^/orders`]: "",
  },
});

const app = express();
app.use("/auth", authProxy);
app.use("/products", productsProxy);
app.use("/orders", ordersProxy);

app.listen(process.env.PORT, () => {
  console.log(`Api Gateway running on port ${process.env.PORT}`);
});
