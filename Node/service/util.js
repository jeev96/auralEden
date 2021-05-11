const crypto = require('crypto');
const request = require("request-promise");
const http = require('http');

module.exports = {
    cleanSearchData: function (data) {
        if (!Array.isArray(data)) {
            return {
                _id: data._id,
                name: data.name,
                format: data.format,
                common: data.common
            }
        }
        return data.map(element => {
            return {
                _id: element._id,
                name: element.name,
                format: element.format,
                common: element.common
            }
        });
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
    getRequestIP: function (request) {
        const ip = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
        return ip.substr(0, 7) == "::ffff:" ? ip.substr(7) : ip;
    },
    getSearchUrlsFormPeers: function (searchString, peers) {
        if (searchString == null || peers.length === 0) {
            return;
        }

        let urls = peers.map(peer => {
            return `http://${peer.ip}:${peer.port}/api/search/${searchString.trim()}`;
        })
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