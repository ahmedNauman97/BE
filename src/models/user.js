const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accessToken: { type: String },
  role: {
    type: String,
    emum: ["ADMIN", "USER"],
    default: "USER",
    required: true,
  },
}, {versionKey: false});

const User = mongoose.model("User", userSchema);

module.exports = User;
