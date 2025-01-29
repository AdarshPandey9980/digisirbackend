require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.MONOGODB_URI);

const express = require("express");
const app = express();

const port = process.env.SERVER_PORT || 3000;

const userRoute = require("./routes/userRoute");

app.use("/api", userRoute);

app.listen(port, function () {
  console.log(`Server started on port ${port}`);
});
