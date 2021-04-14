function main(io) {
	return () => io(server);
}

function io(io) {
	console.log(io);
}
export default main;
