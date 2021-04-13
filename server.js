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
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

server.listen(PORT, () => console.log(`Connected server ${PORT}`));

app.get('/', (req, res) => {
	res.render(__dirname + '/html/index');
});

app.get('/add', (req, res) => {
	const newDoc = new Doc({ value: '', title: '' });
	const id = newDoc._id;
	newDoc
		.save()
		.then(() => {
			Doc.findByIdAndUpdate(id, { value: '', title: id })
				.then(() => {
					res.redirect(`/document/${id}`);
				})
				.catch(e => res.send(`<h1>:( Error...404\n${e}</h1>`));
		})
		.catch(e => res.send(`<h1>:( Error...404\n${e}</h1>`));
});

app.get('/thankyou', (req, res) => {
	res.render(__dirname + '/html/thankyou');
});

app.get('/document/:id', (req, res) => {
	const id = req.params.id;
	console.log('aaa');
	io.on('connection', socket => {
		Doc.findById(id)
			.then(data => {
				console.log('Found', data);
				io.emit('update-text', { value: data.value });
				io.emit('meta', {
					conn: io.engine.clientsCount,
					id,
					title: data.title,
					value: data.value,
					docExists: true,
				});
			})
			.catch(e => {
				console.log('rty', e);
				io.emit('meta', { docExists: false });
			});

		socket.on('update-text', (data, cb) => {
			Doc.findByIdAndUpdate(id, { value: data })
				.then(res => {
					socket.broadcast.emit('update-text', { value: data });
					cb({ status: 200 });
				})
				.catch(e => cb({ status: 404 }));
		});

		socket.on('rename-doc', (data, cb) => {
			Doc.findByIdAndUpdate(id, { title: data })
				.then(value => {
					io.emit('rename-doc', data);
					cb({ status: 200 });
				})
				.catch(e => cb({ status: 404 }));
		});
		socket.on('disconnect', socket => {
			io.emit('meta', { conn: io.engine.clientsCount, docExists: true });
		});
	});
	res.render(__dirname + '/html/document');
});

app.post('/delete/:id', (req, res) => {
	const id = req.params.id;
	Doc.findByIdAndDelete(id)
		.then(success => res.send(success))
		.catch(e => res.send(e));
});
