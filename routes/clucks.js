// this file will hold all the routes


const express = require("express");
const knex = require("../db/client");
const router = express.Router();
const cookieParser = require('cookie-parser');


const logger = require('morgan');



const methodOverride=require('method-override')
router.use(logger('dev')); // add logging middleware




router.use(cookieParser()); //this will parse cookies and put them on request.cookies





module.exports = router;