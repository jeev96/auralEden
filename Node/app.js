const express = require("express"),
    app = express(),
    cors = require('cors'),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    session = require('express-session'),
    fileupload = require("express-fileupload");

// routes
let indexRoutes = require("./routes/index");
let libraryRoutes = require("./routes/library");
let songRoutes = require("./routes/song");

// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;

// const databaseUri = "mongodb+srv://admin:24DeH40dWsEgCfmR@ghar-search.pew8r.mongodb.net/<dbname>?retryWrites=true&w=majority";
const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost/aural-eden';

console.log(databaseUri);

mongoose.connect(databaseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(() => console.log(`Database connected`)).catch(err => console.log(`Database connection error: ${err.message}`));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json()); app.set("view engine", "ejs");
app.use(cors());
app.use(fileupload());
app.use(cookieParser('secret'));


app.use(function (req, res, next) {
    app.locals.moment = require('moment');
    next();
});

// root route
app.use("/api", indexRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/song", songRoutes);

app.listen(3000, function () {
    console.log("The server has started!");
});