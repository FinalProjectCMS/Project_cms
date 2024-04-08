const mongoose = require('mongoose');

const acceptedArticleSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: String,
    image: String,
    category: String
});

module.exports = mongoose.model('AcceptedArticle', acceptedArticleSchema);