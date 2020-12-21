const express = require("express");
const knex = require("../db/client");const path = require("path");
const router = express.Router();
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const logger = require("morgan");
const { response } = require("express");
router.use(cookieParser());


router.use((request, response, next)=>{
  console.log('cookies:', request.cookies)
  const cluckername = request.cookies.cluckername;
  response.locals.cluckername='';
// properties set on res.locals become accessible in any view
  if (cluckername){
    response.locals.cluckername=cluckername;
    console.log(`signed in as ${cluckername}`)
  }
  // next is a function, when invoked it will tell express to move on to the next middleware
  next();
})








// add the request handlers for "sign_in" and "/" maybe "/welcome" if you have it


const ONE_WEEK = 1000 * 60 * 60 * 24 * 7;

router.post("/sign_in", (request, response) => {
  const username = request.body.username;
  response.cookie("username", username, {
    maxAge: ONE_WEEK,
  });
  response.redirect("/");
});

router.get("/", (request, response) => {
  response.redirect("clucks");
});
router.get("/clucks", (request, response) => {
  response.render("clucks");
});
router.get("/welcome", (request, response) => {
  response.render("welcome");
});
router.get("/sign_in", (request, response) => {
  response.render("sign_in");
});

router.get("/new", (request, response) => {
  response.render("new", { cluck: false });
});

// Index need an index page created to work
router.get("/clucks", (request, response) => {
  knex("clucks")
    .orderBy("created_at", "desc")
    .then((clucks) => {
      response.render("clucks", { clucks: clucks });
    });
});





// CREATE NEW
router.post("/new", (request, response) => {
  knex("clucks")
    .insert({
      content: request.body.content,
      image_url: request.body.image_url,
      username: request.cookies.cluckername
    })
    .returning("*")
    .then((clucks) => {
      const cluck = clucks[0];
      response.redirect("clucks");
      // response.redirect(`view/${cluck.id}`);
    });
});
module.exports = router;
