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
            console.log("Starting Seeder.....");
            clientUpload.seed(contentPath, {
                announce: [
                    "http://110.225.244.39:20997/announce",
                    "http://49.36.155.220:20997/announce",
                    "udp://110.225.244.39:20997/",
                    "udp://49.36.155.220:20997/",
                ]
            }, function (torrent) {
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
                    name: torrent.name,
                    torrentId: torrent.infoHash,
                    downloaded: torrent.downloaded,
                    uploaded: torrent.uploaded,
                    upSpeed: torrent.uploadSpeed,
                    downSpeed: torrent.downloadSpeed,
                    completed: torrent.progress,
                    size: torrent.length,
                    shareString: torrent.magnetURI,
                });
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
            console.log("Starting Download...");

            clientDownload.add(shareString, { path: saveLocation }, function (torrent) {
                console.log('Client is downloading:', torrent.infoHash)

                torrent.on('done', function () {
                    clearInterval(interval);
                    console.log('Torrent Download finished');
                    torrent.destroy((id) => {
                        console.log("Torrent destoryed!!");
                    });
                })
                torrent.on("error", function (err) {
                    console.log(err);
                    reject(err);
                })
                torrent.on('warning', function (warning) {
                    console.log("Warning: " + warning);
                })
                resolve({
                    name: torrent.name,
                    torrentId: torrent.infoHash,
                    downloaded: torrent.downloaded,
                    uploaded: torrent.uploaded,
                    upSpeed: torrent.uploadSpeed,
                    downSpeed: torrent.downloadSpeed,
                    completed: torrent.progress,
                    size: torrent.length,
                    shareString: torrent.magnetURI,
                });
            })
        } catch (error) {
            console.log(error);
            return reject(error);
        }
    })
}

function deleteTorrent(torrentId, isUpload) {
    return new Promise((resolve, reject) => {
        let torrent = isUpload ? clientUpload.get(torrentId) : clientDownload.get(torrentId);
        if (torrent == null) {
            reject(new Error("No such torrent Exists"));
        }
        torrent.destroy((id) => {
            console.log("Torrent destoryed!!");
            resolve({
                torrentId: torrentId,
                isUpload: isUpload
            });
        });
    })
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
    stopTorrent: function (torrentId, isUpload) {
        return new Promise((resolve, reject) => {
            deleteTorrent(torrentId, isUpload).then((data) => {
                return resolve(data);
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
    getStats: function (isUpload) {
        return new Promise((resolve, reject) => {
            let data = [];
            const client = isUpload ? clientUpload : clientDownload;

            client.torrents.forEach(torrent => {
                data.push({
                    name: torrent.name,
                    torrentId: torrent.infoHash,
                    downloaded: torrent.downloaded,
                    uploaded: torrent.uploaded,
                    upSpeed: torrent.uploadSpeed,
                    downSpeed: torrent.downloadSpeed,
                    completed: torrent.progress,
                    size: torrent.length,
                    shareString: torrent.magnetURI,
                })
            });

            resolve({
                torrentData: data,
                isUpload: isUpload
            });
        })
    },
    getAllTorrents: function () {
        return new Promise((resolve, reject) => {
            let downloading = [];
            let uploading = [];
            clientDownload.torrents.forEach(torrent => {
                downloading.push({
                    name: torrent.name,
                    torrentId: torrent.infoHash,
                    downloaded: torrent.downloaded,
                    uploaded: torrent.uploaded,
                    upSpeed: torrent.uploadSpeed,
                    downSpeed: torrent.downloadSpeed,
                    completed: torrent.progress,
                    size: torrent.length,
                    shareString: torrent.magnetURI,
                })
            });
            clientUpload.torrents.forEach(torrent => {
                uploading.push({
                    name: torrent.name,
                    torrentId: torrent.infoHash,
                    downloaded: torrent.downloaded,
                    uploaded: torrent.uploaded,
                    upSpeed: torrent.uploadSpeed,
                    downSpeed: torrent.downloadSpeed,
                    completed: torrent.progress,
                    size: torrent.length,
                    shareString: torrent.magnetURI,
                })
            });

            resolve({
                downloading: downloading,
                uploading: uploading
            });
        })
    }
}