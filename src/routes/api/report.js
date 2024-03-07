const express = require("express");
const validateToken = require("../../middleware/authenticateToken");
const reportController = require("../../controllers/reportController");

const reportRouter = express.Router();

const controller = new reportController();


reportRouter.post("/", async (req, res) => {
  try {
    const response = await controller.createReport(req.body, req.user)
  } catch (error) {
    console.log("ERROR POST",error)
    return res.status(error.code).send(error);
  }
});

module.exports = reportRouter;
