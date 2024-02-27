const express = require('express')
const authController = require('../../controllers/authController')
const validateToken = require('../../middleware/authenticateToken')

const authRouter = express.Router()

const controller = new authController

authRouter.post('/signup', validateToken, async (req, res) => {
    try {
        const response = await controller.signup(req.body, req.user)
        res.status(response.code).send(response)
    } catch (error) {
        res.status(error.code).send(error)
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const response = await controller.login(req.body)
        res.status(response.code).send(response)
    } catch (error) {
        res.status(error.code).send(error)
    }
})

authRouter.delete('/delete/:id', validateToken, async (req, res) => {
    try {
        const userId = req.params.id
        console.log(userId)
        const response = await controller.deleteUser(userId, req.user)
        res.status(response.code).send(response)
    } catch (error) {
        res.status(error.code).send(error)
    }
})

module.exports = authRouter

