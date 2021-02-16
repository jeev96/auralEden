const SongMetaData = require("../../models/songMetaData");
const dbConstants = require("../../constants/database");

async function deleteAll() {
    try {
        return SongMetaData.deleteMany({});
    } catch (error) {
        console.log(error);
        throw (error);
    }
}

function queryBuilder(pattern) {
    if (pattern === "")
        return {}
    return {
        "$or": [
            { "name": { '$regex': new RegExp(pattern), '$options': 'i' } },
            { "common.artist": { '$regex': new RegExp(pattern), '$options': 'i' } },
            { "common.album": { '$regex': new RegExp(pattern), '$options': 'i' } }
        ]
    }
}

function sortQuery(sortParams) {
    let colName;
    switch (sortParams.column) {
        case 1: colName = "name"; break;
        case 2: colName = "common.artist"; break;
        case 3: colName = "common.album"; break;
        case 4: colName = "format.duration"; break;
        case 5: colName = "common.rating"; break;
        case 6: colName = "format.bitrate"; break;
        default: colName = "name"; break;
    }
    let sort = sortParams.dir === "asc" ? 1 : -1
    return {
        [colName]: sort
    }
}

module.exports = {
    count: async function (query = {}) {
        try {
            return SongMetaData.countDocuments(query).exec();
        } catch (error) {
            console.log(error);
            throw (error);
        }
    },
    find: async function (query = {}, sort = {}, skip = dbConstants.DEFAULT_SKIP, limit = dbConstants.DEFAULT_LIMIT) {
        try {
            return SongMetaData.find(query).skip(parseInt(skip)).limit(parseInt(limit)).sort(sort).exec();
        } catch (error) {
            console.log(error);
            throw (error);
        }
    },
    findById: async function (listingId) {
        try {
            return SongMetaData.findById(listingId).exec();
        } catch (error) {
            console.log(error);
            throw (error);
        }
    },
    create: async function (data) {
        try {
            return SongMetaData.create(data);
        } catch (error) {
            console.log(error);
            throw (error);
        }
    },
    insertMany: async function (data) {
        try {
            await deleteAll();
            return await SongMetaData.insertMany(data);
        } catch (error) {
            console.log(error);
            throw (error);
        }
    },
    findByIdAndUpdate: async function (listingId, newData) {
        try {
            return SongMetaData.findByIdAndUpdate(listingId, { $set: newData });
        } catch (error) {
            console.log(error);
            throw (error);
        }
    },
    search: async function (pattern, sortParams, skip, limit) {
        const query = queryBuilder(pattern);
        const sort = sortQuery(sortParams);
        return await this.find(query, sort, skip, limit);
    }
}

