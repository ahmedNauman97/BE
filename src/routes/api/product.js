const express = require('express')

const productRouter = express.Router()

productRouter.post('/product', async (req, res) => {
    try {

        const response = await controller.getCategory(req)
        res.status(response.code).send(response)
    } catch (error) {
        res.status(error.code).send(error)
    }
})