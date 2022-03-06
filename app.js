const express = require("express");
const dotenv = require("dotenv").config();

const app = express();
app.use(express.json());


// Database connection
require("./db/connection");

// Home route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to HomeJam" });
});

// 404 API
app.use((req, res) => {
  res.status(404).json({ error: "Page not found" })
});

// Server port
const port = process.env.PORT || 8080;
app.listen(port, (err) => {
  if(err)
    console.log(err);
  console.log(`running on ${port}`);
});