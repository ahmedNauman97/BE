const Giftt = require("../models/giftCard");
const giftCardHtml = require("./giftHtml")
const UpdateSerialNumber = require("../utils/updateSerial")

class giftCardController {
  async createGift(body, user) {
    try {

      const giftFind = await Giftt.find({})
      const serialNumber = giftFind.length + 1

      const Gift = await new Giftt({
        amount:body.amount,
        serialNumber:serialNumber,
        userId: user._id,
      });
      await Gift.save();

      let formattedNumber = String(serialNumber).padStart(6, '0')
      // Get the current date
      const currentDate = new Date(); 
      
      // Format the date as DD:MM:YYYY
      const day = String(currentDate.getDate()).padStart(2, '0');
      const month = String(currentDate.getMonth() + 1).padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}:${month}:${year}`;

      // Format the time as HH:MM
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      const formattedTime = `${hours}:${minutes}`;
      
      const html_content = giftCardHtml.gift_receipt(
        body.amount,
        formattedNumber, 
        formattedDate,
        formattedTime,
        user.name,
      )
      const filePath = 'output.html';
      
      await UpdateSerialNumber.write_html(filePath,html_content)
      // await UpdateSerialNumber.print_receipt(html_content,filePath,false, 350)

      return {
        code: 201,
        message: "Category created successfully",
      };
    } catch (error) {
      console.log(error.message)
      throw {
        code: error.code || 403,
        error: error.message || "Internal server error",
      };
    }
  }

  async getGift(req) {
    try {
      let getCategory;
      if (req.params.id) {
        getCategory = await Giftt.findById(id);
      } else if (!req.params.id) {
        getCategory = await Giftt.find().populate("userId");
      } else {
        throw {
          code: 403,
          message: "Internal server error",
        };
      }
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

  async updateGiftCard(body, id, user) {
    try {
      
      const updatedData = await Giftt.findByIdAndUpdate(
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

  async deleteGift(id, user) {
    try {
      const findCategory = await Giftt.findByIdAndDelete(id);
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

module.exports = giftCardController;
