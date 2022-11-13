const trackerService = require("../service/tracker");
const http = require('http');

const dbService = require("../service/Database/songMetaData");
const utilService = require("../service/util");

async function createGlobalSearchRequest(url) {
    return new Promise(function (resolve, reject) {
        let body = '';
        http.get(url, { timeout: 10 * 1000 }, function (res) {
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                resolve(JSON.parse(body));
            });
        }).on("error", function (error) {
            console.log(error.message);
            resolve(null);
        });
    })
}

async function searchOnlineServers(searchString) {
    try {
        const peers = trackerService.getPeers();
        const urls = utilService.getSearchUrlsFormPeers(searchString, peers);

        const promises = urls.map(url => createGlobalSearchRequest(url));
        const result = await Promise.all(promises);

        return utilService.cleanGlobalSearchData(result);
    } catch (error) {
        console.log(error);
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