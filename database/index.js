const mongoose = require('mongoose');
const DB_URI = process.env.MONGODB_URI_LOCAL;

function main() {
	mongoose.connect(DB_URI, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
		useFindAndModify: false,
	});
	mongoose.connection.once('open', () => console.log('Database connected'));
}
module.exports = main;
