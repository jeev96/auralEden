const express = require("express");
const router = express.Router();

const shareService = require("../service/share");

// share a file on server
router.post("/share-content", function (req, res) {
    shareService.shareContent(req.body.path).then((shareData) => {
        return res.status(200).send({
            shareString: shareData.shareString,
            torrentId: shareData.torrentId,
            name: shareData.name
        });
    }).catch((error) => {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    })
});

// delete seeder
router.post("/stop-share-torrent", function (req, res) {
    shareService.stopSeeding(req.body.torrentId).then((torrentId) => {
        return res.status(200).send({
            torrentId: torrentId
        });
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
router.post("/stop-download-torrent", function (req, res) {
    shareService.stopDownloading(req.body.torrentId).then((torrentId) => {
        return res.status(200).send({
            torrentId: torrentId
        });
    }).catch((error) => {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    })
});

router.post("/stats", function (req, res) {
    shareService.getStats(req.body.torrentId, req.body.isUpload).then((stats) => {
        return res.status(200).send(stats);
    }).catch((error) => {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    })
})

module.exports = router;