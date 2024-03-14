const SerialNumber = require("../models/receiptSerial");
const ZReportSerial = require("../models/zReportSerial");
const XReportSerial = require("../models/xReportSerial");
const fs = require('fs');
const puppeteer = require('puppeteer');
const path = require('path');
const axios = require("axios")
const UpdateSerialNumber = require("../utils/updateSerial")

async function convertHtmlToImage(htmlContent, outputFile,width) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
  
    // Set the content
    await page.setContent(htmlContent);
  
    // Get the total height of the content
    const bodyHeight = await page.evaluate(() => {
        return document.body.scrollHeight;
    });
  
    // Set the viewport height to the height of the content
    await page.setViewport({ width: width, height: bodyHeight + 20 });
  
    // Capture a screenshot of the entire page
    await page.screenshot({ path: outputFile });
  
    await browser.close();
    console.log('HTML converted to image:', outputFile);
}

class OrderMiddleware {

    static async categories_from_orderList(combinedOrders,orderLength) {
        try {

            const groupedCategory = combinedOrders.reduce((accumulator, currentValue) => {
                const categoryId = currentValue.categoryId._id;
                // Check if an entry with the current categoryId exists in the accumulator
                const existingCategory = accumulator.find(item => item.categoryId._id === categoryId);
                if (existingCategory) {
                  // If an entry with the current categoryId exists, push the current order into its orders array
                  existingCategory.orders.push(currentValue);
                } else {
                  // If no entry with the current categoryId exists, create a new entry with the categoryId and the current order
                  accumulator.push({
                    categoryId: currentValue.categoryId,
                    orders: [currentValue]
                  });
                }
                return accumulator;
            }, []);

            // Calculate total sale for each group
            groupedCategory.forEach(group => {
                group.totalSale = group.orders.reduce((total, order) => total + order.price, 0);
            });
            
            // Using reduce with if-else to sum even and odd numbers separately
            const cash_pin_total = groupedCategory.reduce((accumulator, order) => {
              if (order.cash) {
                accumulator.cash += 1;
                accumulator.cashTotal += order.price; 
              } else {
                accumulator.pin += 1;
                accumulator.pinTotal += order.price; 
              }
              
              return accumulator;
            }, { cash: 0, cashTotal:0, pin: 0, pinTotal: 0 });
            
            // Calculate grandTotal
            const grandTotalSales = groupedCategory.reduce((total, group) => total + group.totalSale, 0);

            for (let index = 0; index < combinedOrders.length; index++) {
              combinedOrders[index]["price_quantity"] = 0
            }

            const groupedProduct = combinedOrders.reduce((acc, order) => {
                const foundIndex = acc.findIndex(item => item.productId.equals(order.productId));
                if (foundIndex !== -1) {
                  acc[foundIndex].quantity += order.quantity;
                } else {
                  acc.push({
                    productId: order.productId,
                    name: order.name,
                    quantity: order.quantity,
                    price: order.price,
                    categoryId: order.categoryId,
                  });
                }
                return acc;
            }, []);
            
           


            return {orderLength,groupedCategory,grandTotalSales,groupedProduct}
        } catch (error) {
          console.log("NAUMAN")
            throw {
                code: 404,
                message: "Error in Execution",
              };
        }
    }

    static async updateXSerialNumber() {
      try {
          const number = await XReportSerial.find()
          let count;
          let count_object;
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
    
          if(number.length == 0){
            count = await new XReportSerial({
              serialNumber: 1
            })
            count_object = count
          }else{
            count = await XReportSerial.findByIdAndUpdate(
              number[0]._id,
              {$set: {serialNumber:number[0].serialNumber + 1}},
              { new: true }
            )
            count_object = count
          }
          
          count.save()
          return {count_object,formattedDate,formattedTime}
      } catch (error) {
          throw {
              code: 404,
              message: "Error in Execution",
            };
      }
  }

    static async updateZSerialNumber() {
        try {
            const number = await ZReportSerial.find()
            let count;
            let count_object;
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
      
            if(number.length == 0){
              count = await new ZReportSerial({
                serialNumber: 1
              })
              count_object = count
            }else{
              count = await ZReportSerial.findByIdAndUpdate(
                number[0]._id,
                {$set: {serialNumber:number[0].serialNumber + 1}},
                { new: true }
              )
              count_object = count
            }
            
            count.save()
            return {count_object,formattedDate,formattedTime}
        } catch (error) {
            throw {
                code: 404,
                message: "Error in Execution",
              };
        }
    }

    static async resetSerialNumber() {
      try {
        const number = await SerialNumber.find()

        let count = await SerialNumber.findByIdAndUpdate(
          number[0]._id,
          {$set: {serialNumber:0}},
          { new: true }
        )
        
        count.save()

      } catch (error) {
          throw {
              code: 404,
              message: "Error in Execution",
            };
      }
    }

    static async updateSerialNumber() {
        try {
            const number = await SerialNumber.find()
            let count;
            let count_object;
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
      
            if(number.length == 0){
              count = await new SerialNumber({
                serialNumber: 1
              })
              count_object = count
            }else{
              count = await SerialNumber.findByIdAndUpdate(
                number[0]._id,
                {$set: {serialNumber:number[0].serialNumber + 1}},
                { new: true }
              )
              count_object = count
            }
            
            count.save()
            return {count_object,formattedDate,formattedTime}
        } catch (error) {
            throw {
                code: 404,
                message: "Error in Execution",
              };
        }
    }

    static async print_receipt (html_content,filePath,report=false,width=500) {
       
        fs.writeFile(filePath, html_content, (err) => {
            if (err) {
                console.error('Error writing HTML file:', err);
            } else {
                console.log('HTML file saved successfully!');
                const htmlContent = fs.readFileSync(filePath, 'utf8');

                const outputFilePath = path.join(__dirname, 'output.png');
                convertHtmlToImage(htmlContent, outputFilePath,width)
                    .then(() => {
                    // Read the image file
                    const inputImagePath = path.join(__dirname, 'output.png');
                    const imageData = fs.readFileSync(inputImagePath);
                    axios.post(report ? process.env.PYTHON_BACKEND + "/printReport" : process.env.PYTHON_BACKEND + "/printReceipt", imageData, {
                        headers: {
                            'Content-Type': 'image/png' // Adjust the content type based on your image type
                        }
                    })
                    })
                    .catch((error) => {
                        console.error('Error converting HTML to image:', error);
                });
            }
        });
    }

    static async write_html (filePath,html_content) {

        // File path where you want to save the HTML file
        fs.writeFile(filePath, html_content, (err) => {
            if (err) {
                console.error('Error writing HTML file:', err);
            } else {
            console.log('HTML file saved successfully!');
            }
        });

    }

}


module.exports = OrderMiddleware