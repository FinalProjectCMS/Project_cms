
const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  text: String,
  author: { type: String, default: 'Unknown' },
});

module.exports = mongoose.model('Quote', quoteSchema);
