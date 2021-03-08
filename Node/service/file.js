const fs = require('fs-extra');
const path = require("path");

const musicFileTypes = require("../constants/musicFileTypes");
const allowedMimeTypes = ["audio/mpeg", "audio/ogg", "audio/aac", "audio/mp4", "audio/flac", "audio/x-flac", "audio/wav", "audio/x-ms-wma"]

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

function saveFile(saveLocation, song) {
    return new Promise((resolve, reject) => {
        if (allowedMimeTypes.indexOf(song.mimetype) < 0) {
            reject((Error("File Type Not Allowed!!")));
        }
        fs.access(`${saveLocation}/${song.name}`, async (err) => {
            if (err) {
                await song.mv(`${saveLocation}/${song.name}`);
                console.log(`${song.name} uploaded.`);
                resolve(`${saveLocation}/${song.name}`);
            } else {
                reject(Error("File with this name already exists."));
            }
        });
    })
}

async function saveFiles(saveLocation, songs) {
    try {
        await fs.mkdir(saveLocation, { recursive: true });
        if (!songs) {
            throw (Error("No File Uploaded."));
        }
        if (!songs.data.length) {
            songs.data = [songs.data];
        }
        let saveLocations = [];
        let promiseArray = songs.data.map((song) => saveFile(saveLocation, song));
        const results = await Promise.all(promiseArray);
        results.forEach(location => { saveLocations.push(location); });

        return saveLocations;
    } catch (error) {
        throw (error);
    }
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
    },
    uploadFiles: async function (files) {
        return await saveFiles("D:/Music", files);
    }
}