const express = require("express");
const router = express.Router();
const passport = require('passport');
const passportService = require('../service/passport');
passportService.setStrategy(passport);
const dbService = require("../service/Database/songMetaData");
const fileService = require("../service/file");
const musicService = require("../service/musicInfo");

// directory scan
router.post("/settings", passport.authenticate('jwt', { session: false }), async function (req, res) {
    const token = passportService.getToken(req.headers);
    if (token) {
        return res.status(403).send({ status: "faliure", error: 'Unauthorized.' });
    }
    try {
        const files = await fileService.scanFiles(req.body.mediaLocation);
        const filesMetaData = await musicService.getFileMetaData(files);
        const result = await dbService.insertMany(filesMetaData);
        let data = {
            status: "success",
            mediaLocation: req.body.mediaLocation,
            count: result.length
        }
        return res.status(200).send(data);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
});

router.post("/checkAuth", passport.authenticate('jwt', { session: false }), async function (req, res) {
    const token = passportService.getToken(req.headers);
    if (token) {
        return res.status(403).send({ status: "faliure", error: 'Unauthorized.' });
    }
    try {
        return res.status(200).send({ "data": "authorized" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
});

module.exports = router;