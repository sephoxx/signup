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


fetch(url, {
	method: 'post',
	body: urlencodeFormData(formData),
	headers: {
		'Content-Type' : 'application/x-www-form-urlencoded'
	}
}).then((response) => {
	if (response.ok) {
	  
	} else {
	  throw new Error('Something went wrong');
	}
  })
  .then((responseJson) => {
	console.log(responseJson);
	if (!window.location.href.includes(responseJson.data)) {
		// window.location = `http://${location.hostname}/${response.data}`
		console.log('redirect')
	 }
	 return;
  })
  .catch((error) => {
	
	console.log(error)
	//window.location = `http://${location.hostname}/signup/index.html`;

});
