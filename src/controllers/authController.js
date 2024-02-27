const User = require("../models/user")
const bcrypt = require("bcrypt");
const generateAccessToken = require("../utils/generateAccessToken");

class authController {
    async signup(body, user) {
        if (user.role !== 'ADMIN') {
            throw {
                code: 409,
                message: 'User already exist'
            }
        }
        const checkUser = await User.findOne({ email: body.email })
        if (checkUser) {
            throw {
                code: 409,
                message: 'User already exist'
            }
        }
        if (body.password !== body.conformPassword) {
            throw {
                code: 400,
                message: "Password are not matched",
            };
        }


        const hashPassword = await bcrypt.hash(body.password, 10)


        const newUser = new User({
            name: body.name,
            password: hashPassword,
            role: body.role,
            email: body.email
        })
        newUser.save()

        return {
            code: 201,
            message: 'User Created Successfully'
        }

    }

    async login(body) {
        const checkUser = await User.findOne({ email: body.email })
        if (!checkUser) {
            throw {
                code: 404,
                message: 'User not found'
            }
        }
        const checkPassword = bcrypt.compare(body.password, checkUser.password)
        if (!checkPassword) {
            throw {
                code: 401,
                error: 'Invalid Credentials'
            }
        }


        const accessToken = await generateAccessToken({ email: checkUser.email, role: checkUser.role })
        checkUser.accessToken = accessToken
        await checkUser.save()
        return {
            code: 200,
            message: 'Loggin Successfully',
            user: checkUser
        }
    }


    async deleteUser(userId, user) {
        if (user.role !== 'ADMIN') {
            throw {
                code: 409,
                message: 'User already exist'
            }
        }
        const deleteUser = await User.findByIdAndDelete(userId)
        if (deleteUser) {
            return {
                code: 200,
                message: 'User deleted successfully'
            }
        } else {
            throw {
                code: 403,
                message: 'Internal server error'
            }
        }

    }
}



module.exports = authController