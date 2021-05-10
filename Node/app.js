const express = require("express"),
    app = express(),
    appSearch = express(),
    process = require('process'),
    cors = require('cors'),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    cookieParser = require("cookie-parser"),
    passport = require('passport'),
    fileupload = require("express-fileupload");

const miscConstants = require("./constants/misc");

// routes
let indexRoutes = require("./routes/index");
let authRoutes = require("./routes/auth");
let devicesRoutes = require("./routes/devices");
let libraryRoutes = require("./routes/library");
let sharingRoutes = require("./routes/sharing");
let searchRoutes = require("./routes/search");
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

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
appSearch.use(express.urlencoded({ extended: true }));
appSearch.use(express.json());

app.use(cors());
appSearch.use(cors());

app.use(fileupload());
app.use(passport.initialize());
app.use(cookieParser('secret'));
app.set('trust proxy', true);

app.use(function (req, res, next) {
    app.locals.moment = require('moment');
    next();
});

// root route
app.use("/api", indexRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/devices", devicesRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/share", sharingRoutes);
appSearch.use("/api/search", searchRoutes);
app.use("/api/song", songRoutes);

const server = app.listen(miscConstants.APPLICATION_LOCAL_PORT, function () {
    console.log("The server has started!");
});
appSearch.listen(miscConstants.APPLICATION_SEARCH_PORT, function () {
    console.log("Search server has started!");
})

const io = require('socket.io')(server, {
    cors: {
        origin: ["http://localhost:4200", "http://192.168.1.10:4200", "http://192.168.*.*:4200"],
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    },
    allowEIO3: true
});

const bitTracker = require("./service/tracker");
bitTracker.startTracker();

const socketService = require("./service/socket")(io);
const devicesService = require("./service/devices");

async function test() {
    try {
        await devicesService.offlineAllDevices();
        console.log("All devices offline");
    } catch (error) {
        console.log(error.message);
    }
};
// test();
