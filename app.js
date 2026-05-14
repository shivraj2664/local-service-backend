require("dotenv").config()
const express = require("express");
const connectDB = require("./config/db.js")
const userRoutes= require("./routes/userRoutes.js");
const uploadRoutes = require("./routes/uploadRoutes.js")
const serviceRoutes = require("./routes/serviceRoutes.js")
const app = express();

app.use(express.json());
app.use("/user",userRoutes);
app.use("/api",uploadRoutes);
app.use("/service",serviceRoutes);

connectDB();

app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});