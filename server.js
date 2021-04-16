require('dotenv').config();
const PORT = process.env.PORT || 5000;
const BASE_DIR = __dirname + '/html';
require('./database')();
const app = require('./express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const Doc = require('./database/model/document');

app.get('/', (req, res) => {
	res.redirect('/add');
});

app.get('/add', (req, res) => {
	const newDoc = new Doc({ value: '', title: '', urlID: '' });
	const id = newDoc._id;
	newDoc
		.save()
		.then(() => {
			Doc.findByIdAndUpdate(id, { title: id, urlID: id })
				.then(() => {
					res.redirect(`/document/${id}`);
				})
				.catch(e => res.send(`<h1>:( Error...404\n${e}</h1>`));
		})
		.catch(e => res.send(`<h1>:( Error...404\n${e}</h1>`));
});

app.get('/thankyou', (req, res) => {
	res.render(BASE_DIR + '/thankyou');
});

// app.get('/document/:id', (req, res) => {
// 	const id = req.params.id;
// 	let DATA;
// 	Doc.findById(id)
// 		.then(res => {
// 			DATA = res;
// 			console.log('Found');
// 		})
// 		.catch(e => {
// 			console.log('rty', e);
// 		});
// 	io.on('connection', socket => {
// 		// Doc.findById(id)
// 		// 	.then(data => {
// 		// 		console.log('Found', data);
// 		// 		io.emit('update-text', { value: data.value });
// 		// 		io.emit('meta', {
// 		// 			conn: io.engine.clientsCount,
// 		// 			id,
// 		// 			title: data.title,
// 		// 			value: data.value,
// 		// 			docExists: true,
// 		// 		});
// 		// 	})
// 		// 	.catch(e => {
// 		// 		console.log('rty', e);
// 		// 		io.emit('meta', { docExists: false });
// 		// 	});
// 		io.emit('meta', { conn: io.engine.clientsCount, DATA, event: 'init' });
// 		socket.on('update-text', (data, cb) => {
// 			Doc.findByIdAndUpdate(id, { value: data })
// 				.then(res => {
// 					socket.broadcast.emit('update-text', { value: data });
// 					cb({ status: 200 });
// 				})
// 				.catch(e => cb({ status: 404 }));
// 		});

// 		socket.on('rename-doc', (data, cb) => {
// 			Doc.findByIdAndUpdate(id, { title: data })
// 				.then(value => {
// 					io.emit('rename-doc', data);
// 					cb({ status: 200 });
// 				})
// 				.catch(e => cb({ status: 404 }));
// 		});
// 		socket.on('disconnect', socket => {
// 			io.emit('meta', { conn: io.engine.clientsCount, docExists: true });
// 		});
// 	});
// 	res.render(BASE_DIR + '/document');
// });

// app.use('/test', require('./routes/document.test'));

app.post('/delete/:id', (req, res) => {
	const id = req.params.id;
	Doc.findByIdAndDelete(id)
		.then(success => {
			console.log('success');
			res.json(success);
		})
		.catch(e => res.json(e));
});

server.listen(PORT, () => console.log(`Connected server ${PORT}`));
module.exports = io;
app.use('/document', require('./routes/document'));
