const express = require("express");
const router = express.Router();
const { Readable } = require("stream");
const fs = require("fs-extra");
const path = require("path");
const mime = require('mime-types');

const dbService = require("../service/Database/songMetaData");
const musicService = require("../service/musicInfo");

// get album art
router.get("/albumArt/:id", async function (req, res) {
    try {
        const dbEntry = await dbService.findById(req.params.id);
        const data = await musicService.getFileAlbumArt(dbEntry.location);
        const readStream = new Readable({
            objectMode: true,
            read() { }
        });
        if (data) {
            readStream.push(data.data);
        } else {
            readStream.push("No Image");
        }
        readStream.push(null);
        readStream.pipe(res);
    } catch (error) {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
});

router.get("/stream/:id", async function (req, res) {
    try {
        const dbEntry = await dbService.findById(req.params.id);
        const type = mime.lookup(dbEntry.location);

        const stream = fs.createReadStream(dbEntry.location);
        stream.on('open', function () {
            res.set('Content-Type', type);
            stream.pipe(res);
        });
        stream.on('error', function () {
            res.set('Content-Type', 'text/plain');
            res.status(404).end('Not found');
        });

    } catch (error) {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
})


module.exports = router;