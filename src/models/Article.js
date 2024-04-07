const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: String,
    image: String,
    sentiment: String
});

Article = mongoose.model('Article', this.articleSchema);
module.exports = Article;