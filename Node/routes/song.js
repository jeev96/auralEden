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

        const filePath = dbEntry.location;
        const stat = fs.statSync(filePath);
        const total = stat.size;

        if (req.headers.range) {
            const range = req.headers.range;
            const parts = range.replace(/bytes=/, "").split("-");
            const partialstart = parts[0];
            const partialend = parts[1];

            const start = parseInt(partialstart, 10);
            const end = partialend ? parseInt(partialend, 10) : total - 1;
            const chunksize = (end - start) + 1;
            const readStream = fs.createReadStream(filePath, { start: start, end: end });
            res.writeHead(206, {
                'Content-Range': 'bytes ' + start + '-' + end + '/' + total,
                'Accept-Ranges': 'bytes', 'Content-Length': chunksize,
                'Content-Type': type
            });
            readStream.pipe(res);
        } else {
            res.writeHead(200, { 'Content-Length': total, 'Content-Type': type });
            fs.createReadStream(filePath).pipe(res);
        }
    } catch (error) {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
})


module.exports = router;