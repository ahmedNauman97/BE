const express = require("express");
const validateToken = require("../../middleware/authenticateToken");

const sessionRouter = express.Router();

sessionRouter.get("/", validateToken, async (req, res) => {
  try {
    // const response = await controller.createCategory(req.body, req.user);
    if (req.user) {
      return res
        .status(200)
        .send({ role: req.user.role, message: "Authorized" });
    } else {
      throw {
        code: 401,
        message: "Session Expired",
      };
    }
  } catch (error) {
    return res.status(error.code).send(error);
  }
});

module.exports = sessionRouter;
