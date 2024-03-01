const express = require("express");
const categoryController = require("../../controllers/categoryController");
const validateToken = require("../../middleware/authenticateToken");

const categoryRouter = express.Router();

const controller = new categoryController();

categoryRouter.post("/", validateToken, async (req, res) => {
  try {
    const response = await controller.createCategory(req.body, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});
categoryRouter.get("/:id?", validateToken, async (req, res) => {
  try {
    const response = await controller.getCategory(req);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});
categoryRouter.patch("/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;

    const response = await controller.updateCategory(req.body, id, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error.error);
  }
});
categoryRouter.delete("/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const response = await controller.deleteCatalogue(id, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});

module.exports = categoryRouter;
