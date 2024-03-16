const User = require("../models/user");
const bcrypt = require("bcrypt");
const generateAccessToken = require("../utils/generateAccessToken");

class authController {
  async signup(body, user) {
    try {
      if (user.role !== "ADMIN") {
        throw {
          code: 409,
          message: "User already exist",
        };
      }
      const checkUser = await User.findOne({ email: body.email });
      if (checkUser) {
        throw {
          code: 409,
          message: "User already exist",
        };
      }
      //   if (body.password !== body.conformPassword) {
      //     throw {
      //       code: 400,
      //       message: "Password are not matched",
      //     };
      //   }

      const hashPassword = await bcrypt.hash(body.password, 10);

      const newUser = new User({
        firstName: body.firstName,
        lastName: body.lastName,
        password: hashPassword,
        role: body.role,
        email: body.email,
      });

      await newUser.save();

      return {
        code: 201,
        message: "User Created Successfully",
      };
    } catch (error) {
      throw {
        code: error.code || "403",
        error: error,
      };
    }
  }

  async getUsers(req,specific=false) {
    try {
      let users;
      if (req.user.role !== "ADMIN") {
        throw {
          code: 401,
          message: "Only admin can get access",
        };
      }
      if (req.params.id) {
        users = await User.findById(req.params.id);
      } else {
        users = await User.find({ });
      }
      const filteredUser = users.filter((user) => user.email !== "shaad@gmail.com")
      return {
        code: 200,
        message: "Users get successfully",
        data: filteredUser,
      };
    } catch (error) {
      throw {
        code: error.code || "403",
        error: error,
      };
    }
  }
  async updateUser(body, id, user) {
    try {
      let users;
      if (user.role !== "ADMIN") {
        throw {
          code: 401,
          message: "Only admin can get access",
        };
      }
      let obj = { ...body }
      if(body.password){
        const hashPassword = await bcrypt.hash(body.password, 10);
        let bodyObj = {...body,password:hashPassword}
        obj = { ...bodyObj }
      }
      const updateUser = await User.findByIdAndUpdate(
        id,
        {
          $set: obj,
        },
        { new: true }
      );
      await updateUser.save();
      return {
        code: 200,
        message: "Users get successfully",
        data: users,
      };
    } catch (error) {
      throw {
        code: error.code || "403",
        error: error,
      };
    }
  }

  async login(body) {
    try {
      const checkUser = await User.findOne({ email: body.email });
      if (!checkUser) {
        throw {
          code: 404,
          message: "User not found",
        };
      }

      const checkPassword = await bcrypt.compare(
        body.password,
        checkUser.password
      );
      if (!checkPassword) {
        throw {
          code: 401,
          error: "Invalid Credentials",
        };
      }
      const accessToken = await generateAccessToken({
        email: checkUser.email,
        role: checkUser.role,
      });
      checkUser.accessToken = accessToken;
      await checkUser.save();
      return {
        code: 200,
        message: "Loggin Successfully",
        user: checkUser,
      };
    } catch (error) {
      throw {
        code: error.code || "403",
        error: error,
      };
    }
  }

  async deleteUser(userId, user) {
    if (user.role !== "ADMIN") {
      throw {
        code: 409,
        message: "User already exist",
      };
    }
    const deleteUser = await User.findByIdAndDelete(userId);
    if (deleteUser) {
      return {
        code: 200,
        message: "User deleted successfully",
      };
    } else {
      throw {
        code: 403,
        message: "Internal server error",
      };
    }
  }
}

module.exports = authController;
