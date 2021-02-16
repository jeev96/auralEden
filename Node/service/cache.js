const fs = require('fs-extra');
const path = require("path");

const CACHE_PATH = path.join(__dirname, "../data/cache.txt");

module.exports = {
    getCache: async function () {
        try {
            const data = await fs.readFile(CACHE_PATH);
            return JSON.parse(data);
        } catch (error) {
            console.log(error);
            throw (error);
        }
    },
    setCache: async function (data) {
        try {
            strData = JSON.stringify(data);
            await fs.writeFile(CACHE_PATH, strData);
            return Object.keys(data).length;
        } catch (error) {
            console.log(error);
            throw (error);
        }
    },
    getCount: async function () {
        data = await this.getCache()
        return Object.keys(data).length;
    }
}