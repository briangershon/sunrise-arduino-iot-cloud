const express = require("express");
const { calc } = require('./library');
const PORT = process.env.PORT || 5000;

express()
  .get("/", (req, res) => res.json(calc()))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

