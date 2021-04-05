var socket = io();
const heading = document.querySelector('#title');
const titleTag = document.querySelector('title');
socket.on('update-text', value => {
	notepad.value = value;
});
socket.on('rename-doc', value => {
	heading.innerText = value;
	titleTag.innerText = 'Notepad | ' + value;
});

const notepad = document.querySelector('#notepad');
const spinner = document.querySelector('.spinner');
const saved = document.querySelector('.saved');
let id;
notepad.focus();
notepad.addEventListener('keyup', evt => {
	spinner.style.display = 'block';
	saved.style.display = 'none';
	iSsaved = false;
	clearTimeout(id);
	id = setTimeout(save, 1000);
});
notepad.addEventListener('keydown', () => {
	spinner.style.display = 'block';
	saved.style.display = 'none';
	iSsaved = false;
	clearTimeout(id);
});

function save(e) {
	clearTimeout(id);
	socket.emit('update-text', notepad.value, res => {
		if (res.status === 200) spinner.style.display = 'none';
		saved.style.display = 'block';
	});
}

document.querySelector('.rename').addEventListener('click', () => {
	docName =
		prompt('Enter name for the document', heading.innerText) ||
		heading.innerText;
	socket.emit('rename-doc', docName, res => console.log(res));
});
