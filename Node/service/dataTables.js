function createDataEntry(record) {
    return [
        record._id.toString(),
        record.name,
        record.common.artist ? record.common.artist : "unknown",
        record.common.album ? record.common.album : "unknown",
        Math.trunc(record.format.duration / 60) + ":" + (Math.trunc(record.format.duration % 60) > 9 ? Math.trunc(record.format.duration % 60) : "0" + Math.trunc(record.format.duration % 60)),
        record.common.rating,
        Math.trunc(record.format.bitrate / 1000),
        null
    ]
}

module.exports = {
    createResponseObject: async function (data, draw, totalRecords) {
        try {
            responseData = [];
            for (let record of data) {
                responseData.push(createDataEntry(record));
            }
            return {
                data: responseData,
                draw: +draw,
                recordsFiltered: totalRecords,
                recordsTotal: totalRecords
            };
        } catch (error) {
            console.log(error);
            throw (error);
        }
    },
}