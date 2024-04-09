const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  kind: String,
  etag: String,
  id: String,
  snippet: {
    publishedAt: Date,
    channelId: String,
    title: String,
    description: String,
    thumbnails: {
      default: {
        url: String,
        width: Number,
        height: Number
      },
      medium: {
        url: String,
        width: Number,
        height: Number
      },
      high: {
        url: String,
        width: Number,
        height: Number
      },
      standard: {
        url: String,
        width: Number,
        height: Number
      },
      maxres: {
        url: String,
        width: Number,
        height: Number
      }
    },
    channelTitle: String,
    tags: [String],
    categoryId: String,
    liveBroadcastContent: String,
    defaultLanguage: String,
    localized: {
      title: String,
      description: String
    },
    defaultAudioLanguage: String
  },
  __v: { type: Number, select: false } // __v is automatically added by MongoDB, select: false means it won't be returned in queries by default
}); // Optionally add timestamps to keep track of creation and modification times

module.exports = mongoose.model('Video', VideoSchema);