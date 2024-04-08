
const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
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
  }
});

module.exports = mongoose.model('Video', videoSchema);
