const find = require('local-devices');
const http = require('http');

const miscConstants = require("../constants/misc");

let localServers = [];

function createLocalServerUrls(devices) {
    return devices.map(device => {
        return `http://${device.ip}:${miscConstants.APPLICATION_SEARCH_PORT}/api/deviceSearch/isAlive`;
    })
}

async function createLocalPingRequest(url) {
    return new Promise(function (resolve, reject) {
        let body = '';

        let request = http.get(url, { timeout: 5 * 1000 }, function (res) {
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                try {
                    const response = JSON.parse(body);
                    resolve(response);
                } catch (error) {
                    console.log(error.message);
                    resolve(null);
                }
            });
        }).on("error", function (error) {
            console.log(error.message);
            resolve(null);
        });
        request.on('timeout', () => {
            request.destroy();
        })
    })
}

async function findWebbieServers() {
    find(null, true).then(null, true).then(async (devices) => {
        console.log("Devices on network: " + devices.length);
        const localUrls = createLocalServerUrls(devices);

        const promises = localUrls.map(url => createLocalPingRequest(url));
        return await Promise.all(promises);
    }).then((results) => {
        let webbieIPs = results.filter((data) => data != null && data.status != null && data.status == miscConstants.LOCAL_SEARCH_KEYWORD).map(dataEntry => {
            return dataEntry.ip + ":" + dataEntry.port;
        })
        localServers = webbieIPs;
        console.log(webbieIPs);
    }).catch((error) => {
        console.log(error.message);
    })
}

module.exports = {
    startDiscoveryService: async function () {
        const localServers = await findWebbieServers();
    },
    getLocalServers: function () {
        return localServers;
    }
}