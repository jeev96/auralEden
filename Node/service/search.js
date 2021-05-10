const http = require('http');

const trackerService = require("../service/tracker");
const dbService = require("../service/Database/songMetaData");
const utilService = require("../service/util");

async function searchOnlineServers(searchString) {
    try {
        const peers = trackerService.getPeers();
        const urls = utilService.getSearchUrlsFormPeers(searchString, peers);

        const promises = urls.map(url => utilService.createGlobalSearchRequest(url));
        const result = await Promise.all(promises);

        return await utilService.cleanGlobalSearchData(result);
    } catch (error) {
        console.log(error.message);
        return [];
    }
}

module.exports = {
    getLocalData: async function (searchString) {
        let data = await dbService.search(searchString);
        return utilService.cleanSearchData(data);
    },
    getGlobalData: async function (searchString) {
        return await searchOnlineServers(searchString);
    }
}