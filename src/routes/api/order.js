const orderController = require("../../controllers/orderController");
const validateToken = require("../../middleware/authenticateToken");

const orderRouter = express.Router();

const controller = new orderController();

orderRouter.post("/", validateToken, async (req, res) => {
  try {
    const response = await controller.createOrder(req.body);
    res.status(response.code).send(response);
  } catch (error) {
    res.status(error.code).send(error);
  }
});
