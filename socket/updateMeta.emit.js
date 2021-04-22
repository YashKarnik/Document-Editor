const Doc = require('../database/model/document');

function main(io, socket, doc, id, callback) {
	Doc.findByIdAndUpdate(id, doc)
		.then(res => {
			io.emit('meta', { conn: io.engine.clientsCount, DATA: doc });
			callback({ status: 200 });
		})
		.catch(e => callback({ status: 404 }));
}

module.exports = main;
