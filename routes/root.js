// add the request handlers for "sign_in" and "/" maybe "/welcome" if you have it
const express = require("express");

const router = express.Router();
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

router.post("/sign_in", (request, response) => {
  const username = request.body.username;
  response.cookie("username", username, {
    maxAge: ONE_WEEK
  });
  response.redirect("/");
});

router.get("/", (request, response) => {
  response.render("welcome");
});
router.get("/welcome", (request, response) => {
  response.render("welcome");
});
router.get("/sign_in", (request, response) => {
  response.render("sign_in");
});

module.exports = router;