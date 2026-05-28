require("dotenv").config()
const express = require("express");
const connectDB = require("./config/db.js")
const userRoutes= require("./routes/userRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes.js")
const serviceRoutes = require("./routes/serviceRoutes.js");
const bookingRoutes = require("./routes/bookingRoutes.js");
const app = express();
const cors = require("cors");


app.use(cors());
app.use(express.json());

app.use("/uploads",express.static("uploads"));
app.use(express.json());
app.use("/user",userRoutes);
app.use("/api",uploadRoutes);
app.use("/service",serviceRoutes);
app.use("/book",bookingRoutes);
app.use(cors());

connectDB();

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});