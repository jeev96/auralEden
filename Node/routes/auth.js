const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportService = require('../service/passport');
passportService.setStrategy(passport);

const userDbService = require("../service/Database/user");
const config = require("../constants/database");

router.post('/signup', async function (req, res) {
    if (!req.body.username || !req.body.password || !req.body.device) {
        return res.status(400).send({ success: false, msg: 'Please pass username and password and DeviceId.' });
    }
    try {
        const user = await userDbService.register(req.body);

        const token = jwt.sign(user.toJSON(), config.SECRET, { expiresIn: "24h" });
        return res.status(201).send({
            id: user._id.toString(),
            deviceId: user.devices[0]._id,
            username: user.username,
            token: "JWT " + token,
            expiresIn: 3600 * 24
        });
    } catch (error) {
        return res.status(401).send({ success: false, msg: 'Username already exists.' });
    }
});

router.post('/signin', async function (req, res) {
    if (!req.body.username || !req.body.password || !req.body.device) {
        return res.status(400).send({ success: false, msg: 'Please pass username and password and DeviceId.' });
    }
    try {
        let user = await userDbService.findOne({ username: req.body.username });
        if (!user) {
            res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
        }

        user.comparePassword(req.body.password, async function (err, isMatch) {
            if (isMatch && !err) {
                const token = jwt.sign(user.toJSON(), config.SECRET, { expiresIn: "24h" });

                let deviceId = req.body.device.id;
                let device = user.devices.filter((device) => device._id.toString() === deviceId);
                if (device.length === 0) {
                    user.devices.push({
                        name: req.body.device.name,
                        deviceType: req.body.device.type,
                        active: false,
                        online: false
                    });
                    user = await user.save();
                    deviceId = user.devices[user.devices.length - 1]._id;
                }

                return res.status(200).send({
                    id: user._id.toString(),
                    deviceId: deviceId,
                    username: user.username,
                    token: "JWT " + token,
                    expiresIn: 3600 * 24
                });
            } else {
                return res.status(401).send({ success: false, msg: 'Authentication failed. Wrong password.' });
            }
        });
    } catch (error) {
        return res.status(500).send({ success: false, msg: error.message });
    }
});

router.post("/authenticate", passport.authenticate('jwt', { session: false }), async function (req, res) {
    const token = passportService.getToken(req.headers);
    if (token) {
        return res.status(403).send({ status: "faliure", error: 'Unauthorized.' });
    }
    try {
        const user = await userDbService.findOne({ username: req.body.username });
        if (user && user.devices.filter((device) => device._id.toString() === req.body.deviceId).length !== 1) {
            return res.status(403).send({ status: "faliure", error: 'Unauthorized.' });
        }
        return res.status(200).send({
            status: "success",
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
});

router.post("/logout-all", passport.authenticate('jwt', { session: false }), async function (req, res) {
    const token = passportService.getToken(req.headers);
    if (token) {
        return res.status(403).send({ status: "faliure", error: 'Unauthorized.' });
    }
    try {
        let user = await userDbService.findOne({ username: req.body.username });
        user.devices = [];
        user = await user.save();
        return res.status(200).send({ status: "success" });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
});

module.exports = router;