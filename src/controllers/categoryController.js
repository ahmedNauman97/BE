const { Category } = require("../models/catalogue");

class categoryController {
  async createCategory(body, user) {
    try {
      if (user.role !== "ADMIN") {
        throw {
          code: 409,
          message: "You are not admin",
        };
      }
      const newCategory = await new Category({
        ...body,
      });
      await newCategory.save();
      return {
        code: 201,
        message: "Category created successfully",
      };
    } catch (error) {
      throw {
        code: error.code || 403,
        error: error.message || "Internal server error",
      };
    }
  }

  async getCategory(req) {
    try {
      let getCategory;
      if (req.params.id) {
        getCategory = await Category.findById(id);
      } else if (!req.params.id) {
        getCategory = await Category.find();
      } else {
        throw {
          code: 403,
          message: "Internal server error",
        };
      }
      getCategory = getCategory.filter((category) => category.hide === false)
      getCategory.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
      return {
        code: 200,
        message: "Category find successfully",
        data: getCategory,
      };
    } catch (error) {
      throw {
        code: 403,
        error: "Internal server error",
      };
    }
  }

  async updateCategory(body, id, user) {
    try {
      if (user.role !== "ADMIN" && user.role !== "MANAGER") {
        throw {
          code: 404,
          message: "Only Admin can update",
        };
      }
      const updatedData = await Category.findByIdAndUpdate(
        id,
        { $set: { ...body } },
        { new: true }
      );

      if (!updatedData) {
        throw {
          code: 404,
          message: "Not found",
        };
      }
      return {
        code: 200,
        message: "Category updated successfully",
        data: updatedData,
      };
    } catch (error) {
      throw {
        code: error.code || 403,
        error: error || "Internal server error",
      };
    }
  }

  async deleteCatalogue(id, user) {
    try {
      if (user.role !== "ADMIN") {
        throw {
          code: 401,
          message: "Only Admin can delete",
        };
      }
      const findCategory = await Category.findByIdAndUpdate(id,
        { $set: { hide:true} },
        { new: true }
      )
      if (!findCategory) {
        throw {
          code: 404,
          message: "Category not found",
        };
      }
      return {
        code: 200,
        message: "Category deleted successfully",
      };
    } catch (error) {
      throw {
        code: error.code || 403,
        message: error.message || "Internal server error",
      };
    }
  }
}

module.exports = categoryController;
