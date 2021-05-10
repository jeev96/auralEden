const express = require("express");
const router = express.Router();

const searchService = require("../service/search");
const miscConstants = require("../constants/misc");

// get search results from own server
router.post("/", async function (req, res) {
    try {
        const ownData = await searchService.getLocalData(req.body.searchString);
        const otherData = await searchService.getGlobalData(req.body.searchString);
        return res.status(200).send({
            ownServer: ownData,
            otherServers: otherData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
});

// send search results from own server
router.get("/:searchString", async function (req, res) {
    try {
        console.log("global search");
        const results = await searchService.getLocalData(req.params.searchString);
        return res.status(200).send({
            data: results,
            ip: req.socket.remoteAddress,
            port: miscConstants.APPLICATION_SEARCH_PORT
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