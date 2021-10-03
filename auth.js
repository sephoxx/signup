const url = 'http://192.168.0.1:3000/login'
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
			// window.location = `http://${location.hostname}/${response.data}`
			console.log('redirect')
		} else {
			console.log('all good');
		}
	}
	else if (this.status === 400) {
		console.log('Something went wrong')
	}
}

xhr.send(urlencodeFormData(formData));