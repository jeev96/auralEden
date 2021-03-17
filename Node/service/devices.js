const userDbService = require("./Database/user");

module.exports = {

    changeDeviceStatus: async function (username, deviceId, online = false, active = false) {
        try {
            let user = await userDbService.findOne({ username: username });
            let device = user.devices.filter((device) => device._id.toString() === deviceId);
            if (device.length === 1) {
                device = device[0];
                device["online"] = online;
                device["active"] = active;
                user = await user.save();
            }
        } catch (error) {
            throw (error);
        }
    },
    getAllDevices: async function (username) {
        try {
            let user = await userDbService.findOne({ username: username });
            return user.devices.filter(device => device.online === true)
        } catch (error) {
            throw (error);
        }
    },
    offlineAllDevices: async function () {
        try {
            let users = await userDbService.find({});
            users.map(async (user) => {
                user.devices.map(async (device) => {
                    const result = await userDbService.update({ "_id": user._id, "devices._id": device._id }, { "devices.$.online": false });
                })
            });
        } catch (error) {
            throw (error);
        }
    }
}