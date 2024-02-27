const { Category } = require("../models/catalogue")


class categoryController {
    async createCategory(body, user) {
        try {
            if (user.role !== 'ADMIN') {
                throw {
                    code: 409,
                    message: 'User already exist'
                }
            }
            const newCategory = await new Category({
                ...body
            })
            newCategory.save()
            return {
                code: 201,
                message: 'Category created successfully'
            }
        } catch (error) {
            throw {
                code: 403,
                error: 'Internal server error'
            }
        }
    }
    async getCategory(req) {
        try {
            let getCategory
            if (req.params.id) {
                getCategory = await Category.findById(id)
            } else if (!req.params.id) {
                getCategory = await Category.find()
            } else {
                throw {
                    code: 403,
                    message: 'Internal server error'
                }
            }
            return {
                code: 200,
                message: 'Category find successfully',
                data: getCategory
            }
        } catch (error) {
            throw {
                code: 403,
                error: 'Internal server error'
            }
        }
    }

    async updateCategory(body, id) {
        const updatedData = await Category.findByIdAndUpdate(id, { $set: { ...body } }, { new: true })
        if (!updatedData) {
            throw {
                code: 404,
                message: 'Not found'
            }
        }
        return {
            code: 200,
            message: 'Category updated successfully',
            data: updatedData
        }
    }

    async deleteCatalogue(id) {
        try {
            const findCategory = await Category.findByIdAndDelete(id)
            if (!findCategory) {
                throw {
                    code: 404,
                    message: 'Category not found'
                }
            }
            return {
                code: 200,
                message: 'Category deleted successfully'
            }
        } catch (error) {
            throw {
                code: error.code || 403,
                message: error.message || 'Internal server error'

            }
        }
    }
}

module.exports = categoryController