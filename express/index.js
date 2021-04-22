const express = require('express');
function main() {
	const app = express();
	app.use(express.static(__dirname + '/../public'));
	app.set('view engine', 'ejs');
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	return app;
}
module.exports = main;
