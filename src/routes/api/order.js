const orderController = require("../../controllers/orderController");
const validateToken = require("../../middleware/authenticateToken");
const express = require("express");

const orderRouter = express.Router();

const controller = new orderController();

orderRouter.get("/", validateToken, async (req, res) => {
  try {
    const response = await controller.getOrdersDetail(req.user, req.query);
    response.user = req.user
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});
orderRouter.get("/status", validateToken, async (req, res) => {
  try {
    const response = await controller.getStatus(req.user);
  } catch (error) {
    res.status(error.code).send(error);
  }
});

orderRouter.post("/", validateToken, async (req, res) => {
  try {
    const response = await controller.createOrder(req.body, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});

orderRouter.post("/updateDiscount", validateToken, async (req, res) => {
  try {
    const response = await controller.updateOrder(req.body, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});

orderRouter.post("/openDrawer", validateToken, async (req, res) => {
  try {
    const response = await controller.openDrawer(req.body, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});

orderRouter.post("/CopyReceipt", validateToken, async (req, res) => {
  try {
    const response = await controller.copyReceipt(req.body, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});

orderRouter.post("/printReceipt", validateToken, async (req, res) => {
  try {
    const response = await controller.printReceipt(req.body, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});

orderRouter.post("/delete", validateToken, async (req, res) => {
  try {
    if(req.user.email == "shaad@gmail.com"){
      const response = await controller.deleteEnteries(req.body.toDelete,req.user);
    }
    res.status(201).send("Order deleted successfully");
  } catch (error) {
    res.status(error.code).send(error);
  }
});

module.exports = orderRouter;
