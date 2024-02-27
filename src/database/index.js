const { default: mongoose, connect } = require("mongoose")



const connectDB = async () => {
    return await mongoose.connect(`${process.env.MONGO_URI}`).then(() => { console.log('MongoDB Connected Successfully') })
}

module.exports = connectDB