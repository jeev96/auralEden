const fs = require('fs-extra');
const path = require("path");

const musicFileTypes = require("../constants/musicFileTypes");

async function scanMusicFiles(dir, allFiles = []) {
    const files = (await fs.readdir(dir)).map(file => {
        return path.join(dir, file);
    });
    allFiles.push(...files);
    await Promise.all(files.map(async file => (
        (await fs.stat(file)).isDirectory() && scanMusicFiles(file, allFiles)
    )))
    allFiles = allFiles.filter(file => {
        for (let [key, value] of Object.entries(musicFileTypes)) {
            if (path.extname(file) === value)
                return true;
        }
        return false;
    })

    return allFiles;
}

async function deleteFile(fileLocation) {
    try {
        fs.remove(fileLocation);
        return "File Deleted";
    } catch (error) {
        throw (error);
    }
}

async function renameFile(oldPath, newPath) {
    try {
        await fs.rename(oldPath, newPath);
        return "File Renamed";
    } catch (error) {
        throw (error);
    }
}

async function emptyDir(dirLocation) {
    try {
        await fs.emptyDir(dirLocation);
        return "Directory Cleared";
    } catch (error) {
        throw (error);
    }
}

module.exports = {
    scanFiles: async function (paths = []) {
        try {
            let files = [];
            for (let path of paths) {
                try {
                    const tempFiles = await scanMusicFiles(path);
                    files.push(...tempFiles);
                } catch (error) {
                    throw (error);
                }
            };
            return files;
        } catch (error) {
            throw (error);
        }
    }
}