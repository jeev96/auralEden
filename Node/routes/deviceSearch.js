const express = require("express");
const router = express.Router();

const utilService = require("../service/util");
const miscConstants = require("../constants/misc");

router.get("/isAlive", function (req, res) {
    res.status(200).send({ 
        status: miscConstants.LOCAL_SEARCH_KEYWORD,  
        ip: utilService.getRequestIP(req),
        port: miscConstants.APPLICATION_SEARCH_PORT
    });
})

module.exports = router;