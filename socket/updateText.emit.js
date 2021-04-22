const Doc = require('../database/model/document');

function main(socket, value, id, callback) {
	Doc.findByIdAndUpdate(id, { value })
		.then(res => {
			socket.broadcast.emit('update-text', { value });
			callback({ status: 200 });
		})
		.catch(e => callback({ status: 404 }));
}

module.exports = main;
