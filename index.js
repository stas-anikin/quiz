// all the necessary modules
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
app.use(express.static(path.join(__dirname, "public")));
const logger = require("morgan");
const { response } = require("express");
app.set("view engine", "ejs");
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
const knex = require("./db/client");


app.use((request, response, next)=>{
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

app.post('/sign_in', (request, response) => {
  // req.body holds all the info from the post request
  const COOKIE_EXPIRE = 1000 * 60 * 60 * 24 * 7;
  const cluckername = request.body.cluckername;
  response.cookie('cluckername', cluckername, { maxAge: COOKIE_EXPIRE });
  response.redirect('/welcome');
})

app.post('/sign_out', (request, response)=>{
  response.clearCookie('cluckername')
  response.redirect('/sign_in')
})

//router setup
const clucksRouter = require('./routes/clucks');
app.use("/clucks", clucksRouter);
const rootRouter = require('./routes/root');
app.use("/", rootRouter);


// This is us setting up a localhost server
const ADDRESS = "localhost";
const PORT = 3003;
app.listen(PORT, ADDRESS, () => {
  console.log(`Server listening on ${ADDRESS}:${PORT}`);
});

