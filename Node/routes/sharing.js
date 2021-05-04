const express = require("express");
const router = express.Router();

const shareService = require("../service/share");

router.get("/all-torrents", function (req, res) {
    shareService.getAllTorrents().then((torrentData) => {
        return res.status(200).send(torrentData);
    }).catch((error) => {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    })
})

// share a file on server
router.post("/share-content", function (req, res) {
    shareService.shareContent(req.body.path).then((shareData) => {
        return res.status(200).send(shareData);
    }).catch((error) => {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    })
});

// download a file to server
router.post("/download-content", function (req, res) {
    shareService.downloadContent(req.body.shareString, req.body.saveLocation).then((torrentData) => {
        return res.status(200).send(torrentData);
    }).catch((error) => {
        console.log(error);
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    })
});

// delete downloader
router.post("/stop-torrent", function (req, res) {
    shareService.stopTorrent(req.body.torrentId, req.body.isUpload).then((data) => {
        return res.status(200).send(data);
    }).catch((error) => {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    })
});

router.post("/stats", function (req, res) {
    shareService.getStats(req.body.isUpload).then((stats) => {
        return res.status(200).send(stats);
    }).catch((error) => {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    })
})

module.exports = router;