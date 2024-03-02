const express = require("express");
const authRouter = require("./api/auth");
const categoryRouter = require("./api/category");
const productRouter = require("./api/product");
const sessionRouter = require("./api/session");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/category", categoryRouter);
router.use("/product", productRouter);
router.use("/order", productRouter);
router.use("/session", sessionRouter);

module.exports = router;
