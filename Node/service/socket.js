const devicesService = require("../service/devices");

exports = module.exports = async function (io) {
    io.sockets.on('connection', async (socket) => {
        socket.on("login", async (data) => {
            console.log("login");
            try {
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

        socket.on("logout", async (data) => {
            console.log("logout");
            try {
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

        function handleDeviceError(username) {
            const responseData = {
                username: username,
                devices: []
            }
            io.emit("broadcastDevices", responseData);
        }
    });
}