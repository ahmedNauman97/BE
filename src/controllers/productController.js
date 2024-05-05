const { Product, Category } = require("../models/catalogue");

class productController {
  async createProduct(body) {
    try {
      const newProduct = await new Product({
        ...body,
      });
      newProduct.save();
      if (!newProduct) {
        throw {
          code: 403,
          message: "internal server error",
        };
      }
      return {
        code: 201,
        message: "Product Created Successfully",
        data: newProduct,
      };
    } catch (error) {
      throw {
        code: 403,
        error: error,
      };
    }
  }

  async getProducts(id) {
    try {
      let products;

      if (id) {
        products = await Product.find({ categoryId: id }).populate(
          "categoryId"
        );
      } else {
        products = await Product.find().populate("categoryId");
      }

      products = products.filter((product) => product.hide === false && product.categoryId.hide === false )

      const productsWithCategoryNames = products.map((product) => ({
        _id: product._id,
        name: product.name,
        barcode:product.barcode,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
        sequenceNumber: product.sequenceNumber,
        categoryId: product.categoryId._id,
        category: product.categoryId
          ? product.categoryId.name
          : "Uncategorized",
      }));
      productsWithCategoryNames.sort((a, b) => a.sequenceNumber - b.sequenceNumber);
      return {
        code: 200,
        message: "Data found successfully",
        data: productsWithCategoryNames,
      };
    } catch (error) {
      throw {
        code: error.code || 403,
        error: error || "Internal server error",
      };
    }
  }

  async updateProduct(body, id) {
    try {
      //   if (user.role !== "ADMIN" && user.role !== "MANAGER") {
      //     throw {
      //       code: 401,
      //       message: "Only Admin can update",
      //     };
      //   }
      const findProduct = await Product.findByIdAndUpdate(
        id,
        { $set: { ...body } },
        { new: true }
      );
      if (!findProduct) {
        throw {
          code: 404,
          message: "Product Not found",
        };
      }
      return {
        code: 200,
        message: "Updated successfully",
      };
    } catch (error) {
      throw {
        code: error.code || 403,
        error: error || "Internal server error",
      };
    }
  }
  async deleteProduct(id, user) {
    try {
      if (user.role !== "ADMIN") {
        throw {
          code: 401,
          message: "Only Admin can delete",
        };
      }
      const findProduct = await Product.findByIdAndUpdate(id,
        { $set: { hide:true} },
        { new: true }
      )
      if (!findProduct) {
        throw {
          code: 404,
          message: "Product Not found",
        };
      }
      return {
        code: 200,
        message: "Updated successfully",
      };
    } catch (error) {
      throw {
        code: error.code || 403,
        error: error || "Internal server error",
      };
    }
  }
}

module.exports = productController;
