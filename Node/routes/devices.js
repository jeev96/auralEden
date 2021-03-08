const express = require("express");
const router = express.Router();
const passport = require('passport');
const passportService = require('../service/passport');
passportService.setStrategy(passport);

const devicesService = require("../service/devices");

router.post("/change-status", passport.authenticate('jwt', { session: false }), async function (req, res) {
    const token = passportService.getToken(req.headers);
    if (token) {
        return res.status(403).send({ status: "faliure", error: 'Unauthorized.' });
    }
    if (!req.body.username || !req.body.deviceId) {
        return res.status(400).send({ success: false, msg: 'Please pass username, DeviceId' });
    }
    try {
        await devicesService.changeDeviceStatus(req.body.username, req.body.deviceId, req.body.online, req.body.active);
        return res.status(200).send({ status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
});

router.post("/online", passport.authenticate('jwt', { session: false }), async function (req, res) {
    const token = passportService.getToken(req.headers);
    if (token) {
        return res.status(403).send({ status: "faliure", error: 'Unauthorized.' });
    }
    if (!req.body.username) {
        return res.status(400).send({ success: false, msg: 'Please pass username.' });
    }
    try {
        const devices = await devicesService.getAllDevices(req.body.username);

        return res.status(200).send({
            devices: devices
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
});

module.exports = router;