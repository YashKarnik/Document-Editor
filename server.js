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
	// res.render(BASE_DIR + '/index');
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

app.post('/delete/:id', (req, res) => {
	const id = req.params.id;
	Doc.findByIdAndDelete(id)
		.then(success => {
			res.json(success);
		})
		.catch(e => res.json(e));
});

server.listen(PORT, () => console.log(`Connected server ${PORT}`));
module.exports = io;
app.use('/document', require('./routes/document'));
