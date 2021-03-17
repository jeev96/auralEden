const { changeDeviceStatus } = require("../service/devices");
const devicesService = require("../service/devices");

let connectedClients = {};

exports = module.exports = async function (io) {
    io.sockets.on('connection', async (socket) => {
        const joinRoom = (username) => {
            socket.join(username);
            console.log(`Socket ${socket.id} joined room ${username}`)
        };

        const leaveRoom = (username) => {
            socket.leave(username, () => console.log(`Socket ${socket.id} joined room ${username}`));
            console.log(`Socket ${socket.id} left room ${username}`)
        }

        // login logout
        socket.on("deviceOnline", async (data) => {
            try {
                connectedClients[data.deviceId] = socket.id;
                joinRoom(data.username);
                await changeDeviceStatus(data.username, data.deviceId, true, false);
                const devices = await devicesService.getAllDevices(data.username);
                const responseData = {
                    username: data.username,
                    devices: devices
                }
                io.emit("broadcastDevices", responseData);
            } catch (error) {
                handleDeviceError(data.username);
            }
        });

        socket.on("deviceOffline", async (data) => {
            try {
                delete connectedClients[data.deviceId];
                leaveRoom(data.username);
                await changeDeviceStatus(data.username, data.deviceId, false, false);
                const devices = await devicesService.getAllDevices(data.username);
                const responseData = {
                    username: data.username,
                    devices: devices
                }
                io.emit("broadcastDevices", responseData);
            } catch (error) {
                handleDeviceError(data.username);
            }
        });

        socket.on("controlDevice", async (data) => {
            io.emit("broadcastControlDevice", data);
        });

        // setting State
        socket.on("setState", async (data) => {
            io.emit("broadcastSetState", data);
        });

        socket.on("getState", async (data) => {
            socket.to(data.username).emit("broadcastGetState", data);
        });

        function handleDeviceError(username) {
            const responseData = {
                username: username,
                devices: []
            }
            io.emit("broadcastDevices", responseData);
        }
    });
}