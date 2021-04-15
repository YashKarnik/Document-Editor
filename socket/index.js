// const io = require('../server');
const updateText = require('./updateText.emit');
function connect(io, socket, DATA) {
	const id = DATA._id;
	io.emit('meta', { DATA, conn: io.engine.clientsCount });
	socket.on('update-text', (value, callback) =>
		updateText(socket, value, id, callback)
	);
	socket.on('disconnect', client => {
		io.emit('meta', { DATA, conn: io.engine.clientsCount });
	});
}

module.exports = connect;
