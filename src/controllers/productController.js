const { Product } = require("../models/catalogue")


class product {
    async createProduct(body) {
        try {
            const newProduct = await new Product({
                ...body
            })
            newProduct.save()

        } catch (error) {
            throw {
                code: 403,
                message: error
            }
        }
    }
}