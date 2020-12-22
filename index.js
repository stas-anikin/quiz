const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
app.use(express.static(path.join(__dirname, "public")));
const logger = require("morgan");
const { response } = require("express");
app.set("view engine", "ejs");
const knex = require("./db/client");
const moment=require('moment')

app.use(express.urlencoded({ extended: true }));
app.use(
  methodOverride((req, res) => {
    if (req.body && req.body._method) {
      const method = req.body._method;
      return method;
    }
  })
);
app.use(cookieParser());

const rootRouter = require("./routes/root");
app.use("/", rootRouter);

const ADDRESS = "localhost";
const PORT = 3003;
app.listen(PORT, ADDRESS, () => {
  console.log(`Server listening on ${ADDRESS}:${PORT}`);
});