const jwt = require("jsonwebtoken");
const User = require("../models/user");

const validateToken = async (req, res, next) => {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(401).send("Unauthorized");
    }
    const splitToken = token.split(" ")[1];

    const data = await jwt.verify(splitToken, process.env.ACCESS_TOKEN_KEY);

    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.status(404).send("User not found");
    }

    req.user = {
      email: user.email,
      role: user.role,
      _id: user?._id,
    };
    next();
  } catch (error) {
    return res.status(error.code || 401).send(error.message || "Unauthorized");
  }
};

module.exports = validateToken;
