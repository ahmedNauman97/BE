const express = require('express')
const categoryController = require('../../controllers/categoryController')

const categoryRouter = express.Router()

const controller = new categoryController

categoryRouter.post('/', async (req, res) => {
    try {
        const response = await controller.createCategory(req.body)
        res.status(response.code).send(response)
    } catch (error) {
        res.status(error.code).send(error)
    }
})
categoryRouter.get('/:id?', async (req, res) => {
    try {

        const response = await controller.getCategory(req)
        res.status(response.code).send(response)
    } catch (error) {
        res.status(error.code).send(error)
    }
})
categoryRouter.patch('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const response = await controller.updateCategory(req.body, id)
        res.status(response.code).send(response)
    } catch (error) {
        res.status(error.code).send(error)
    }
})
categoryRouter.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id
        const response = await controller.deleteCatalogue(id)
        res.status(response.code).send(response)
    } catch (error) {
        res.status(error.code).send(error)
    }
})


module.exports = categoryRouter
