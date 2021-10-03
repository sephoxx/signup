const url = 'http://192.168.0.1:3000/login'
const loginURL = `http://${location.hostname}/signup/index.html`;
let data = window.localStorage.getItem('credentials');
console.log(data);

data = JSON.parse(data);

const formData = new FormData();
formData.append('email', data.email);
formData.append('password', data.password)

function urlencodeFormData(fd){
    var s = '';
    function encode(s){ return encodeURIComponent(s).replace(/%20/g,'+'); }
    for(var pair of fd.entries()){
        if(typeof pair[1]=='string'){
            s += (s?'&':'') + encode(pair[0])+'='+encode(pair[1]);
        }
    }
    return s;
}

var xhr = new XMLHttpRequest();
xhr.open('POST', url, true);

xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

xhr.onreadystatechange = function () {
	if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
		console.log(xhr.response);
		if (!window.location.href.includes(xhr.response)) {
			window.location = `http://${location.hostname}/${xhr.resp}`
			console.log('redirect')
		} else {
			console.log('all good');
		}
	}
	else if (this.status === 400) {
		console.log('Something went wrong');
		if (data !== null)
		{
			window.localStorage.clear();
			window.location = loginURL;
		}
	}
	else if (this.status === 0 && this.readyState === XMLHttpRequest.DONE) {
		document.getElementsByTagName('html')[0].innerHTML = '';
	}
}

xhr.onloadend = function () {
	if(this.status === 404)
	{
		document.getElementsByTagName('html')[0].innerHTML = '';
		throw new Error('Server replied with 404');
	}
}

xhr.send(urlencodeFormData(formData));