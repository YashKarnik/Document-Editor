var socket = io();
const heading = document.querySelector('#title');
const titleTag = document.querySelector('title');
const deleteBTN = document.querySelector('.delete');
deleteBTN.style.display = 'none';
let currDocID;
socket.on('update-text', ({ value }) => {
	notepad.value = value;
});
socket.on('rename-doc', value => {
	heading.innerText = value;
	titleTag.innerText = 'Notepad | ' + value;
});
socket.on('meta', ({ conn, id }) => {
	document.querySelector('.online').innerText = conn;
	currDocID = id;
	console.log(currDocID);
	if (currDocID) deleteBTN.style.display = 'block';
});

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
	socket.emit('update-text', notepad.value, res => {
		if (res.status === 200) spinner.style.display = 'none';
		saved.style.display = 'block';
	});
}

document.querySelector('.rename').addEventListener('click', () => {
	docName =
		prompt('Enter name for the document', heading.innerText) ||
		heading.innerText;
	socket.emit('rename-doc', docName, res => {
		if (res.status == 404) alert('Error in renaming..Please retry');
	});
});

document.querySelector('.delete').addEventListener('click', () => {
	let conf = confirm('Confirm Delete?');
	if (conf == false) return;
	fetch(`/delete/${currDocID}`, { method: 'POST' })
		.then(res => res.json())
		.then(res => window.location.replace('/thankyou'));
});
