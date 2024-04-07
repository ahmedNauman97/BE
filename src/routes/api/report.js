const express = require("express");
const validateToken = require("../../middleware/authenticateToken");
const reportController = require("../../controllers/reportController");

const reportRouter = express.Router();

const controller = new reportController();


reportRouter.get("/", validateToken, async (req, res) => {
  try {
    const response = await controller.getReport(req.body, req.user)
    res.status(response.code || 200).send(response);
  } catch (error) {
    return res.status(error.code).send(error);
  }
});

reportRouter.delete("/:id", validateToken, async (req, res) => {
  try {
    const response = await controller.deleteReport(req.params.id, req.user);
    res.status(response.code).send(response);
  } catch (error) {
    console.log("BAD REQUEST")
    res.status(error.code).send(error);
  }
});

reportRouter.post("/", validateToken, async (req, res) => {
  try {
    const response = await controller.createReport(req.body, req.user)
    res.status(response.code || 200).send(response);
  } catch (error) {
    return res.status(error.code).send(error);
  }
});

reportRouter.post("/date", validateToken, async (req, res) => {
  try {
    const response = await controller.createReport(req.body, req.user)
    res.status(response.code || 200).send(response);
  } catch (error) {
    return res.status(error.code).send(error);
  }
});

reportRouter.post("/x", validateToken, async (req, res) => {
  try {
    const response = await controller.createReportX(req.body, req.user)
    res.status(response.code || 200).send(response);
  } catch (error) {
    return res.status(error.code).send(error);
  }
});

module.exports = reportRouter;
