const WebTorrent = require('webtorrent');
const fs = require('fs-extra');

let clientUpload = new WebTorrent();
let clientDownload = new WebTorrent();

function createShareClient(contentPath) {
    return new Promise((resolve, reject) => {
        try {
            if (!fs.existsSync(contentPath)) {
                return reject(new Error("Path does not Exist!"));
            }
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
                console.log("seeders: " + clientUpload.torrents.length);
                return resolve({
                    shareString: torrent.magnetURI,
                    torrentId: torrent.infoHash,
                    name: torrent.name
                });
            })
        } catch (error) {
            return reject(error);
        }
    })
}

function deleteShareTorrent(torrentId) {
    return new Promise((resolve, reject) => {
        let torrent = clientUpload.get(torrentId);
        if (torrent == null) {
            reject(new Error("No such torrent Exists"));
        }
        torrent.destroy((id) => {
            console.log("Torrent destoryed!!");
            resolve(torrentId);
        });
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

            clientDownload.add(shareString, { path: saveLocation }, function (torrent) {
                interval = setInterval(onProgress, 2000);
                console.log('Client is downloading:', torrent.infoHash)

                torrent.on('done', function () {
                    clearInterval(interval);
                    console.log('Torrent Download finished');
                    torrent.destroy((id) => {
                        console.log("Torrent destoryed!!");
                        resolve(torrentId);
                    });
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
                resolve({
                    name: torrent.name,
                    torrentId: torrent.infoHash,
                    size: torrent.length
                });
            })
        } catch (error) {
            console.log(error);
            return reject(error);
        }
    })
}

function deleteDownloadTorrent(torrentId) {
    return new Promise((resolve, reject) => {
        let torrent = clientDownload.get(torrentId);
        if (torrent == null) {
            reject(new Error("No such torrent Exists"));
        }
        torrent.destroy((id) => {
            console.log("Torrent destoryed!!");
            resolve(torrentId);
        });
    })
}

function prettyBytes(num) {
    let exponent, unit, neg = num < 0, units = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
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
            createShareClient(contentPath).then((shareData) => {
                return resolve(shareData);
            }).catch((error) => {
                return reject(error);
            })
        })
    },
    stopSeeding: function (torrentId) {
        return new Promise((resolve, reject) => {
            deleteShareTorrent(torrentId).then((torrentId) => {
                return resolve(torrentId);
            }).catch((error) => {
                return reject(error);
            })
        })
    },
    downloadContent: function (shareString, saveLocation) {
        return new Promise((resolve, reject) => {
            createDownloadClient(shareString, saveLocation).then((torrentData) => {
                return resolve(torrentData);
            }).catch((error) => {
                return reject(error);
            })
        })
    },
    stopDownloading: function (torrentId) {
        return new Promise((resolve, reject) => {
            deleteDownloadTorrent(torrentId).then((torrentId) => {
                return resolve(torrentId);
            }).catch((error) => {
                return reject(error);
            })
        })
    },
    getStats: function (torrentId, isUpload) {
        return new Promise((resolve, reject) => {
            const torrent = isUpload ? clientUpload.get(torrentId) : clientDownload.get(torrentId);
            if (torrent == null) {
                reject(new Error("No such torrent Exists"));
            }
            resolve({
                torrentId: torrent.infoHash,
                downloaded: torrent.downloaded,
                uploaded: torrent.uploaded,
                upSpeed: torrent.uploadSpeed,
                downSpeed: torrent.downloadSpeed,
                completed: torrent.progress
            });
        })
    }
}