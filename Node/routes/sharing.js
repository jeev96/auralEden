const express = require("express");
const router = express.Router();

const shareService = require("../service/share");

// share a file on server
router.post("/share-content", function (req, res) {
    shareService.shareContent(req.body.path).then((shareString) => {
        return res.status(200).send({
            shareString: shareString
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
    shareService.downloadContent(req.body.shareString, req.body.saveLocation).then((status) => {
        return res.status(200).send({
            status: status
        })
    }).catch((error) => {
        console.log(error);
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    })
});

module.exports = router;