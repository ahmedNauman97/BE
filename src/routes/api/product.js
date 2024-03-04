const express = require("express");
const validateToken = require("../../middleware/authenticateToken");
const productController = require("../../controllers/productController");

const productRouter = express.Router();
const controller = new productController();

productRouter.post("/", validateToken, async (req, res) => {
  try {
    console.log("product");
    const response = await controller.createProduct(req.body, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});
productRouter.get("/:id?", validateToken, async (req, res) => {
  try {
    const response = await controller.getProducts(req.params.id);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});
productRouter.patch("/:id", validateToken, async (req, res) => {
  try {
    const response = await controller.updateProduct(req.body, req.params.id);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});
productRouter.delete("/:id", validateToken, async (req, res) => {
  try {
    const response = await controller.deleteProduct(req.params.id, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});

module.exports = productRouter;
