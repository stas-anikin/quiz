const express = require("express");
const knex = require("../db/client");
const router = express.Router();
const moment=require('moment')

let date = new Date();
let current_hour = date.getHours();
let current_minute=date.getMinutes();
// Getting cluckername from cookies into a constant to be used
router.use((request, response, next) => {
  console.log("cookies:", request.cookies);
  const cluckername = request.cookies.cluckername;
  response.locals.cluckername = "";
  if (cluckername) {
    response.locals.cluckername = cluckername;
    console.log(`signed in as ${cluckername}`);
  }
  next();
});

//HOME PAGE - redirects to index of clucks
router.get("/", (request, response) => {
  response.redirect("clucks");
});
//SIGN IN PAGE
router.get("/sign_in", (request, response) => {
  response.render("sign_in");
});
//NEW CLUCK
router.get("/new", (request, response) => {
  response.render("new", { cluck: false });
});

//INDEX
router.get("/clucks", (request, response) => {


  knex("clucks")
    .orderBy("created_at", "desc")
    .then((clucks) => {
      response.render("clucks", { clucks: clucks, moment: moment });
    });
});
const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

// SIGN IN
router.post("/sign_in", (request, response) => {
  const COOKIE_EXPIRE = 1000 * 60 * 60 * 24 * 7;
  const cluckername = request.body.cluckername;
  response.cookie("cluckername", cluckername, { maxAge: COOKIE_EXPIRE });
  response.redirect("/new");
});
// SIGN OUT
router.post("/sign_out", (request, response) => {
  response.clearCookie("cluckername");
  response.redirect("/sign_in");
});

// CREATE NEW
router.post("/new", (request, response) => {
  knex("clucks")
    .insert({
      content: request.body.content,
      image_url: request.body.image_url,
      username: request.cookies.cluckername,
    })
    .returning("*")
    .then((clucks) => {
      const cluck = clucks[0];
      response.redirect("clucks");
    });
});
// 




module.exports = router;
