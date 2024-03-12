const express = require("express");
const authRouter = require("./api/auth");
const categoryRouter = require("./api/category");
const productRouter = require("./api/product");
const sessionRouter = require("./api/session");
const orderRouter = require("./api/order");
const reportRouter = require("./api/report");
const giftCardRouter = require("./api/giftCard");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/category", categoryRouter);
router.use("/product", productRouter);
router.use("/order", orderRouter);
router.use("/session", sessionRouter);
router.use("/report", reportRouter);
router.use("/giftCard", giftCardRouter);

module.exports = router;
