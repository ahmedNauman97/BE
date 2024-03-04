const User = require("../models/user");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const createAdmin = async () => {
  try {
    if (!process.env.PASSWORD || !process.env.NAME || !process.env.EMAIL) {
      throw new Error("Missing required environment variables");
    }
    const hashPassword = await bcrypt.hash(process.env.PASSWORD, 10);
    const adminCredentials = {
      name: process.env.NAME,
      email: process.env.EMAIL,
      password: hashPassword,
      role: "ADMIN",
    };

    const newUser = new User(adminCredentials);
    await newUser.save();
    return {
      code: 200,
      message: "Admin Created Sucessfully",
    };
  } catch (error) {
    throw {
      code: 403,
      error: error,
    };
  }
};

createAdmin()
  .then((result) => {})
  .catch((error) => {
    console.log("Error occue in admin preceed data", error);
  });
