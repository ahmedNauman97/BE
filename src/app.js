const express = require("express");
const cors = require("cors");
const path = require("path");
const dotenv = require("dotenv");
const router = require("./routes");
const connectDB = require("./database");

dotenv.config();
const port = process.env.PORT || 4040;

const app = express();

app.use(cors());
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use("/*", (req, res) => res.send("404 Error"));

const appPromise = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  });
};

appPromise();

module.exports = app;
