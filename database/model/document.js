const mongoose = require('mongoose');
const doc = new mongoose.Schema({
	title: { type: String, required: false },
	value: { type: String, required: false },
	urlID: { type: String, required: false, unique: true },
});

module.exports = new mongoose.model('doc', doc);
