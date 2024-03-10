const express = require("express");
const validateToken = require("../../middleware/authenticateToken");
const reportController = require("../../controllers/reportController");

const reportRouter = express.Router();

const controller = new reportController();


reportRouter.post("/", validateToken, async (req, res) => {
  try {
    console.log("HANZLA")
    const response = await controller.createReport(req.body, req.user)
    res.status(response.code || 200).send(response);
  } catch (error) {
    console.log("ERROR POST",error)
    return res.status(error.code).send(error);
  }
});

module.exports = reportRouter;
