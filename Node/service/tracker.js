const Client = require('bittorrent-tracker');

const miscConstants = require('../constants/misc');
const utilService = require("../service/util");

let peerIPs = [];

const requiredOpts = {
    infoHash: Buffer.from(utilService.getHashSHA1(miscConstants.APPLICATION_INFO_HASH)),
    peerId: Buffer.from(utilService.genId(miscConstants.PEER_ID)),
    announce: miscConstants.TRACKER_URLS,
    port: miscConstants.APPLICATION_SEARCH_PORT
}

const client = new Client(requiredOpts);

client.on('error', function (err) {
    console.log("Tracker Error: " + err.message)
})

client.on('warning', function (warn) {
    console.log("Tracker Warning: " + warn.message)
})

client.on('update', function (data) {
    if (data.peers || data.peers6) {
        peers = group(data.peers, 6).map(address => {
            return {
                ip: address.slice(0, 4).join('.'),
                port: address.readUInt16BE(4)
            }
        })
        // peers = group(data.peers6, 18).map(address => {
        //     return {
        //         ip: address.slice(0, 16).map(num => num.toString(16)),
        //         port: address.readUInt16BE(4)
        //     }
        // })
        console.log(peers);
        peerIPs = peers;
    }
})

function group(iterable, groupSize) {
    let groups = [];
    for (let i = 0; i < iterable.length; i += groupSize) {
        groups.push(iterable.slice(i, i + groupSize));
    }
    return groups;
}

module.exports = {
    startTracker: function () {
        client.start();
    },
    stopTracker: function () {
        client.stop();
    },
    updateTracker: function () {
        client.update();
    },
    getPeers: function () {
        return peerIPs;
    }
}