const express = require('express')
const authRouter = require('./api/auth')
const categoryRouter = require('./api/category')

const router = express.Router()

router.use('/auth', authRouter)
router.use('/category', categoryRouter)

module.exports = router