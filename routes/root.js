const express = require("express");
const knex = require("../db/client");
const router = express.Router();
const moment = require("moment");

let date = new Date();
let current_hour = date.getHours();
let current_minute = date.getMinutes();
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

router.get("/schools", function (req, res) {
  var schools;
  knex("schools")
    .select()
    .then(function (ret) {
      schools = ret;
      return knex("students").select();
    })
    .then(function (students) {
      res.render("schools", {
        students: students,
        schools: schools,
      });
    });
});

//INDEX this is working code, below is experimental
router.get("/clucks", (request, response) => {
  let clucks;
  knex("clucks")
    .orderBy("created_at", "desc")
    .then((ret) => {
      clucks = ret;
      return knex("hashtags").select("*");
    })
    .then(function (hashtags) {
      response.render("clucks", {
        clucks: clucks,
        moment: moment,
        hashtags: hashtags,
      });
    });
});

// //INDEX this is working code, below is experimental
// router.get("/clucks", (request, response) => {
//   knex("clucks")
//     .orderBy("created_at", "desc")
//     .then((clucks) => {
//       response.render("clucks", { clucks: clucks, moment: moment });
//     });
// });

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

//this function will check for hashtags once a new cluck is created
const trending = (response, hashtags) => {
  if (hashtags.length === 0) {
    response.redirect("/");
  } else {
    let trend = hashtags.pop();
    knex
      .select()
      .from("hashtags")
      .where("hashtag", trend)
      .then((check) => {
        if (check.length === 0) {
          knex
            .insert({ hashtag: trend, count: 1 })
            .into("hashtags")
            .then(() => {
              trending(response, hashtags);
            });
        } else {
          knex("hashtags")
            .where("hashtag", trend)
            .increment("count", 1)
            .then(() => {
              trending(response, hashtags);
            });
        }
      });
  }
};
router.post("/new", (request, response) => {
  let content = request.body.content;
  let image_url = request.body.image_url;
  let username = request.cookies.cluckername;
  let hashtags = content.split(" ").filter((word) => word[0] === "#");

  knex
    .insert({
      username,
      content,
      image_url,
    })
    .into("clucks")
    .then(() => {
      trending(response, hashtags);
    });
});

module.exports = router;
