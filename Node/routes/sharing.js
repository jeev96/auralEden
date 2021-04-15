const express = require("express");
const router = express.Router();

// share a file on server
router.post("/share-content", async function (req, res) {
    try {
        console.log(req.body.path);

        return res.status(200).send({
            shareString: req.body.path
        });
    } catch (error) {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
});

module.exports = router;