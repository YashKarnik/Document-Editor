const Router = require('express').Router();
const Doc = require('../database/model/document');
const BASE_DIR = __dirname + '/../html';
Router.route('/:id')
	.get((req, res) => {
		console.log('Get request');
		const id = req.params.id;
		Doc.findById(id)
			.then(response => res.render(BASE_DIR + '/document', { response }))
			.catch(error => res.render(BASE_DIR + '/error', { error }));
	})
	.delete((req, res) => {
		const id = req.params.id;
		console.log('del');
		Doc.findByIdAndDelete(id)
			.then(response => {
				console.log(response);
				res.json({ status: 'SUCCESS', response });
			})
			.catch(er => res.json({ status: 'ERROR', response }));
	});

module.exports = Router;
