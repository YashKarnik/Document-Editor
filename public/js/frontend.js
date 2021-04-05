const ham = document.querySelector('.hamburger');
let docName = 'New Document';
ham.addEventListener('click', () => {
	document.querySelectorAll('.menu-btns').forEach(e => {
		e.classList.toggle('entrance-right');
		e.classList.toggle('exit-right');
	});
});
