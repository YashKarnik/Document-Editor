// const io = require('../server');
const updateText = require('./updateText.emit');
const updateMeta = require('./updateMeta.emit');
function connect(io, socket, DATA) {
	const id = DATA._id;
	io.emit('meta', { DATA, conn: io.engine.clientsCount });
	socket.on('update-text', (value, callback) =>
		updateText(socket, value, id, callback)
	);
	socket.on('disconnect', client => {
		io.emit('meta', { DATA, conn: io.engine.clientsCount });
	});
	socket.on('meta', (doc, callback) => {
		updateMeta(io, socket, doc, id, callback);
	});
}

module.exports = connect;
