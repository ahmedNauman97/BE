const express = require("express");
const giftCardController = require("../../controllers/giftCardController");
const validateToken = require("../../middleware/authenticateToken");

const giftCardRouter = express.Router();

const controller = new giftCardController();

giftCardRouter.post("/", validateToken, async (req, res) => {
  try {
    const response = await controller.createGift(req.body, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});
giftCardRouter.get("/:id?", validateToken, async (req, res) => {
  try {
    const response = await controller.getGift(req);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});
giftCardRouter.patch("/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;

    const response = await controller.updateGiftCard(req.body, id, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error.error);
  }
});
giftCardRouter.delete("/:id", validateToken, async (req, res) => {
  try {
    const id = req.params.id;
    const response = await controller.deleteGift(id, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});

module.exports = giftCardRouter;
