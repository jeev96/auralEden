const crypto = require('crypto');
const path = require('path');

module.exports = {
    cleanSearchData: function (data) {
        if (!Array.isArray(data)) {
            return {
                _id: data._id,
                name: data.name,
                filesize: element.filesize,
                filename: path.basename(data.location),
                format: data.format,
                common: data.common
            }
        }
        return data.map(element => {
            return {
                _id: element._id,
                name: element.name,
                filesize: element.filesize,
                filename: path.basename(element.location),
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
                    address: {
                        ip: dataEntry.address.ip,
                        port: dataEntry.address.port
                    }
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
        const ip = request.hostname;
        return ip.substr(0, 7) == "::ffff:" ? ip.substr(7) : ip;
    },
    getSearchUrlsFromPeers: function (searchString, peers) {
        if (searchString == null || peers.length === 0) {
            return;
        }

        let urls = peers.map(peer => {
            return `http://${peer.ip}:${peer.port}/api/search/${searchString.trim()}`;
        })
        return urls;
    }
}