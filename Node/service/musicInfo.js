const musicMetadata = require('music-metadata');
const util = require('util');
const path = require("path");
const fs = require("fs-extra");

async function readMetadata(path, skipCovers = true) {
    try {
        const metadata = await musicMetadata.parseFile(path, { skipCovers: skipCovers });
        return metadata;
    } catch (error) {
        throw (error);
    }
}

function parseMetadata(metaData, location) {
    data = {
        name: metaData.common.title ? metaData.common.title : path.parse(location).name,
        filesize: fs.statSync(location).size,
        common: {
            albumartist: metaData.common.albumartist,
            genre: metaData.common.genre,
            album: metaData.common.album,
            year: metaData.common.year,
            composer: metaData.common.composer,
            artists: metaData.common.artists,
            artist: metaData.common.artist,
            title: metaData.common.title,
            date: metaData.common.date,
            rating: typeof musicMetadata.ratingToStars(metaData.common.rating) === Number ? musicMetadata.ratingToStars(metaData.common.rating) === Number : 0
        },
        format: {
            lossless: metaData.format.lossless,
            codec: metaData.format.codec,
            sampleRate: metaData.format.sampleRate,
            numberOfChannels: metaData.format.numberOfChannels,
            bitrate: metaData.format.bitrate,
            duration: metaData.format.duration
        },
        location: location
    }

    return data;
}

module.exports = {
    getFileMetaData: async function (files = []) {
        let data = [];
        for (const audioFile of files) {
            try {
                const metaData = await readMetadata(audioFile);
                data.push(parseMetadata(metaData, audioFile));
            } catch (error) {
                throw (error);
            }
        };
        return data;
    },
    getFileAlbumArt: async function (file) {
        const metaData = await readMetadata(file, false);
        return metaData.common.picture && metaData.common.picture.length > 0 ? metaData.common.picture[0] : null;
    }
}