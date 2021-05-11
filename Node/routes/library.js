const express = require("express");
const router = express.Router();

const dbService = require("../service/Database/songMetaData");
const fileService = require("../service/file");
const musicService = require("../service/musicInfo");
const dataTablesService = require("../service/dataTables");

// get datatables display data
router.post("/", async function (req, res) {
    try {
        const totalRecords = await dbService.count();
        const data = await dbService.search(req.body.search.value, req.body.order[0], req.body.start, req.body.length);
        const responseData = await dataTablesService.createResponseObject(data, req.body.draw, totalRecords);

        return res.status(200).send(responseData);
    } catch (error) {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
});

router.post("/upload", async function (req, res) {
    try {
        console.log(req.files);
        const fileLocations = await fileService.uploadFiles(req.files);
        const filesMetaData = await musicService.getFileMetaData(fileLocations);
        const result = await dbService.insertMany(filesMetaData, false);

        let data = {
            status: "success",
            count: result.length
        }
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
})

// get single file data
router.get("/:id", async function (req, res) {
    try {
        const data = await dbService.findById(req.params.id);
        return res.status(200).send(data);
    } catch (error) {
        return res.status(500).send({
            status: "faliure",
            error: error.message
        });
    }
});

// get total
router.get("/count", async function (req, res) {
    const count = await dbService.count();

    return res.status(200).send({
        count: count
    });
});

module.exports = router;