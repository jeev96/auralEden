const mongoose = require("mongoose");

let songMetaDataSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    filesize: {
        type: Number,
    },
    common: {
        albumartist: String,
        genre: [String],
        album: String,
        year: String,
        composer: [String],
        artists: [String],
        artist: String,
        title: String,
        date: String,
        rating: Number
    },
    format: {
        lossless: Boolean,
        codec: String,
        sampleRate: Number,
        numberOfChannels: Number,
        bitrate: Number,
        duration: Number
    },
    location: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model("SongMetaData", songMetaDataSchema);