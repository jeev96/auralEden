const express = require("express");
const router = express.Router();
const dbService = require("../service/Database/songMetaData");
const fileService = require("../service/file");
const musicService = require("../service/musicInfo");


// directory scan
router.post("/settings", async function (req, res) {
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



module.exports = router;