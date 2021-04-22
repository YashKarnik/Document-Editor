var socket = io();
const heading = document.querySelector('#title');
const titleTag = document.querySelector('title');
const MainLoading = document.querySelector('.main-spinner');
let currDocID;
let current_Doc;
socket.on('meta', ({ conn, DATA }) => {
	if (DATA) {
		current_Doc = DATA;
		document.querySelector('.online').innerText = conn;
		notepad.value = DATA.value || '';
		heading.innerText = titleTag.innerText = DATA.title;
		MainLoading.style.display = 'none';
	}
});
socket.on('update-text', ({ value }) => {
	current_Doc.data = value;
	notepad.value = current_Doc.data;
});
// socket.on('rename-doc', value => {
// 	heading.innerText = value;
// 	titleTag.innerText = 'Notepad | ' + value;
// });

const notepad = document.querySelector('#notepad');
const spinner = document.querySelector('.spinner');
const saved = document.querySelector('.saved');
let TimeOutID;
notepad.focus();
notepad.addEventListener('keyup', evt => {
	spinner.style.display = 'block';
	saved.style.display = 'none';
	iSsaved = false;
	clearTimeout(TimeOutID);
	TimeOutID = setTimeout(save, 1000);
});
notepad.addEventListener('keydown', () => {
	spinner.style.display = 'block';
	saved.style.display = 'none';
	iSsaved = false;
	clearTimeout(TimeOutID);
});

function save(e) {
	clearTimeout(TimeOutID);
	current_Doc.value = notepad.value;
	socket.emit('update-text', current_Doc.value, res => {
		if (res.status === 200) {
			spinner.style.display = 'none';
			saved.style.display = 'block';
		}
	});
}

document.querySelector('.rename').addEventListener('click', () => {
	docName =
		prompt('Enter name for the document', heading.innerText) ||
		heading.innerText;
	current_Doc.title = docName;
	socket.emit('meta', current_Doc, res => {
		if (res.status == 404) alert('Error in renaming..Please retry');
	});
});

document.querySelector('.delete').addEventListener('click', () => {
	let conf = confirm('Confirm Delete?');
	if (conf == false) return;
	fetch(`../delete/${current_Doc._id}`, { method: 'POST' })
		.then(res => res.json())
		.then(res => {
			window.location.replace('/thankyou');
			console.log(res);
		});
});
