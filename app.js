const express = require("express");
const cors = require("cors");
require('dotenv').config();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/users");
const authRoutes = require("./routes/auth");
const getDataRoute = require("./routes/getData");
const paymentRoute = require("./routes/payment");
const forgotpassRoute = require("./routes/passReset");
const feedbackRoute = require('./routes/FeedbackRoute');
const booksRoute = require('./routes/books');
const purchaseRoute = require('./routes/purchaseRoute');
const usergetRoute = require('./routes/sendUser');


const app = express()

app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/getdata", getDataRoute);
app.use("/api/esewa/initiate-payment", paymentRoute);
app.use("/api/auth/forgot-password", forgotpassRoute);
app.use("/api/feedback", feedbackRoute);
app.use('/api/books', booksRoute);
app.use("/api/getusers", usergetRoute);
app.use("/api/purchase", purchaseRoute);
app.use(cookieParser());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    //start server
    app.listen(process.env.PORT, () => {
      console.log("DB $ Server connected Sucessfully");
    });
  })
  .catch((err) => {
    console.log(err);
  });