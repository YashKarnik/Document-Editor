const Router = require('express').Router();
const io = require('../server');
const connect = require('../socket');
const Doc = require('../database/model/document');
const BASE_DIR = __dirname + '/../html';
Router.route('/:id')
	.get((req, res) => {
		// console.log('Get request');
		const id = req.params.id;
		Doc.findById(id)
			.then(response => {
				res.render(BASE_DIR + '/document');
				io.on('connection', socket => connect(io, socket, response));
			})
			.catch(error => res.render(BASE_DIR + '/error'));
	})
	.delete((req, res) => {
		const id = req.params.id;
		console.log('delete request');
		Doc.findByIdAndDelete(id)
			.then(response => {
				res.json({ status: 'SUCCESS', response });
			})
			.catch(er => res.json({ status: 'ERROR', response }));
	});
module.exports = Router;
