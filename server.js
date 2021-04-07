require('dotenv').config();
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGODB_URI_LOCAL;

const express = require('express');
const mongoose = require('mongoose');
const Doc = require('./model/document');
mongoose.connect(DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useCreateIndex: true,
	useFindAndModify: false,
});
mongoose.connection.once('open', () => console.log('Database connected'));

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

server.listen(PORT, () => console.log(`Connected server ${PORT}`));
app.get('/', (req, res) => {
	const newDoc = new Doc({ value: '', title: 'New Document' });
	newDoc
		.save()
		.then(e => res.redirect(`/${newDoc._id}`))
		.catch(e => res.send(`<h1>:( Error...404\n${e}</h1>`));
});
app.get('/:id', (req, res) => {
	const id = req.params.id;
	io.on('connection', socket => {
		io.emit('meta', io.engine.clientsCount);
		Doc.findById(id)
			.then(data => {
				io.emit('update-text', data.value || '');
				io.emit('rename-doc', data.title);
			})
			.catch(e => console.log(e));
		socket.on('update-text', (data, cb) => {
			Doc.findByIdAndUpdate(id, { value: data })
				.then(value => {
					socket.broadcast.emit('update-text', data);
					cb({ status: 200 });
				})
				.catch(e => cb({ status: 404 }));
		});

		socket.on('rename-doc', (data, cb) => {
			Doc.findByIdAndUpdate(id, { title: data })
				.then(value => {
					io.emit('rename-doc', value.title);
					cb({ status: 200 });
				})
				.catch(e => cb({ status: 404 }));
		});
		socket.on('disconnect', socket => {
			io.emit('meta', io.engine.clientsCount);
		});
	});
	res.sendFile(__dirname + '/index.html');
});
