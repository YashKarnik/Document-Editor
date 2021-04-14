const Router = require('express').Router();
const Doc = require('../database/model/document');

Router.route('/').get((req, res) => {
	Doc.find().then(response => res.json(response));
});

module.exports = Router;
