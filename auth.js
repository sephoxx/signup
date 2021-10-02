const url = 'http://192.168.0.1:3000/login'
const data = window.localStorage.getItem('credentials');

fetch(url, {
	method: 'post',
	body: `email=${data.email}&password=${data.password}`
}).then((response) => {
	if (response.ok) {
	  if (!window.location.href.includes(response.data)) {
		  window.location = `http://${location.hostname}/${response.data}`
	  }
	  return;
	} else {
	  throw new Error('Something went wrong');
	}
  })
  .then((responseJson) => {
	// Do something with the response
  })
  .catch((error) => {
	
	console.log(error)
	window.location = `http://${location.hostname}/signup/index.html`;

});
