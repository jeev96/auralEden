const crypto = require('crypto');
const request = require("request-promise");
const http = require('http');

module.exports = {
    cleanSearchData: function (dataArray) {
        const cleanedData = dataArray.map(element => {
            return {
                name: element.name,
                format: element.format,
                common: element.common
            }
        });
        return cleanedData;
    },
    cleanGlobalSearchData: function (dataArray) {
        let cleanedData = [];
        dataArray.filter(data => data != null).forEach(dataEntry => {
            const searchResults = dataEntry.data.map(element => {
                return {
                    ...element,
                    ip: dataEntry.ip,
                    port: dataEntry.port
                }
            });
            cleanedData.push(...searchResults);
        })
        return cleanedData;
    },
    getHashSHA1: function (value) {
        return crypto.createHash('sha1').update(value).digest();
    },
    genId: function (value) {
        let id = crypto.randomBytes(20);
        Buffer.from(value).copy(id, 0);

        return id;
    },
    getSearchUrlsFormPeers: function (searchString, peers) {
        if (searchString == null || peers.length === 0) {
            return;
        }

        let urls = peers.map(peer => {
            return `http://${peer.ip}:${peer.port}/api/search/${searchString.trim()}`;
        })
        // urls.push(`http://localhost:3000/api/search/${searchString.trim()}`)
        return urls;
    },
    createGlobalSearchRequest: async function (url) {
        return new Promise(function (resolve, reject) {
            let body = '';
            http.get(url, function (res) {
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
}