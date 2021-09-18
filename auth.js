if (window.localStorage.getItem('credentials') === null) {
	window.location = `http://${location.hostname}`;
}
