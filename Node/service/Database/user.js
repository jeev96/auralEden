const User = require("../../models/user");
const dbConstants = require("../../constants/database");

module.exports = {
    count: async function (query = {}) {
        try {
            return await User.countDocuments(query).exec();
        } catch (error) {
            console.log(error.message);
            throw (error);
        }

    },
    find: async function (query = {}, sort = {}, skip = dbConstants.DEFAULT_SKIP, limit = dbConstants.DEFAULT_LIMIT) {
        try {
            return await User.find(query).skip(parseInt(skip)).limit(parseInt(limit)).sort(sort).exec();
        } catch (error) {
            console.log(error.message);
            throw (error);
        }
    },
    findOne: async function (query = {}) {
        try {
            return await User.findOne(query).exec();
        } catch (error) {
            console.log(error.message);
            throw (error);
        }
    },
    findById: async function (listingId) {
        try {
            return await User.findById(listingId).exec();
        } catch (error) {
            console.log(error.message);
            throw (error);
        }
    },
    register: async function (userData) {
        try {
            let newUser = new User({
                username: userData.username,
                password: userData.password,
                devices: [{
                    name: userData.device.name,
                    deviceType: userData.device.type,
                    active: false,
                    online: false
                }]
            });
            return await newUser.save();
        } catch (error) {
            console.log(error.message);
            throw (error);
        }
    },
    findByIdAndUpdate: async function (listingId, newData) {
        try {
            return await User.findByIdAndUpdate(listingId, { $set: newData });
        } catch (error) {
            console.log(error.message);
            throw (error);
        }
    },
    update: async function (query, newData) {
        try {
            return await User.updateOne(query, { $set: newData })
        } catch (error) {
            console.log(error.message);
            throw (error);
        }
    },
    updateMany: async function (query, newData) {
        try {
            return await User.updateMany(query, { $set: newData }, { multi: true });
        } catch (error) {
            console.log(error.message);
            throw (error);
        }
    },
    delete: async function (query) {
        try {
            return await User.deleteOne(query);
        } catch (error) {
            console.log(error.message);
            throw (error);
        }
    }
}