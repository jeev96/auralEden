const WebTorrent = require('webtorrent');
const fs = require('fs-extra');

let clientUpload = null;
let clientDownload = null;

function createShareClient(contentPath) {
    return new Promise((resolve, reject) => {
        try {
            if (!fs.existsSync(contentPath)) {
                return reject(new Error("Path does not Exist!"));
            }

            clientUpload = new WebTorrent({ dht: true });
            clientUpload.seed(contentPath, function (torrent) {
                torrent.on("seed", function (params) {
                    console.log("Seeding Now....");
                })
                torrent.on("error", function (err) {
                    console.log("ERROR: " + err);
                    reject(err);
                })
                torrent.on('warning', function (warning) {
                    console.log("WARNING: " + warning);
                })
                return resolve(torrent.magnetURI);
            })
        } catch (error) {
            return reject(error);
        }
    })
}

function createDownloadClient(shareString, saveLocation) {
    return new Promise((resolve, reject) => {
        try {
            if (!fs.existsSync(saveLocation)) {
                return reject(new Error("Save location does not Exist!"));
            }
            console.log(saveLocation);
            let interval = null;

            clientDownload = new WebTorrent({ dht: true });
            clientDownload.add(shareString, { path: saveLocation }, function (torrent) {
                // Got torrent metadata!
                interval = setInterval(onProgress, 2000);
                console.log('Client is downloading:', torrent.infoHash)

                torrent.on('done', function () {
                    clearInterval(interval);
                    console.log('torrent download finished')
                    clientDownload = null;
                })
                torrent.on("error", function (err) {
                    console.log(err);
                    reject(err);
                })
                torrent.on('warning', function (warning) {
                    console.log("Warning: " + warning);
                })
                function onProgress() {
                    console.log("speeds: " + prettyBytes(torrent.downloadSpeed) + ", ")
                    console.log(prettyBytes(torrent.uploadSpeed) + ", " + torrent.progress);
                }
                resolve("OK");
            })
        } catch (error) {
            console.log(error);
            return reject(error);
        }
    })
}

function prettyBytes(num) {
    var exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    if (neg) num = -num
    if (num < 1) return (neg ? '-' : '') + num + ' B'
    exponent = Math.min(Math.floor(Math.log(num) / Math.log(1024)), units.length - 1)
    num = Number((num / Math.pow(1024, exponent)).toFixed(2))
    unit = units[exponent]
    return (neg ? '-' : '') + num + ' ' + unit
}

module.exports = {
    shareContent: function (contentPath) {
        return new Promise((resolve, reject) => {
            createShareClient(contentPath).then((shareString) => {
                return resolve(shareString);
            }).catch((error) => {
                return reject(error);
            })
        })
    },
    downloadContent: function (shareString, saveLocation) {
        return new Promise((resolve, reject) => {
            createDownloadClient(shareString, saveLocation).then((status) => {
                return resolve(status);
            }).catch((error) => {
                return reject(error);
            })
        })
    }
}