const html = `
<div class='mainContainer'>
            <input id='file' type='file']>
            <button onclick="send()">submit</button>
    </div>
`

const targetFile = document.getElementById('file').value;

function send () {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://192.168.0.1:3000/upload', true);

xhr.setRequestHeader("Content-type", "image/jpg");

    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            alert('success!');
        }
    }

    xhr.onloadend = function () {

    }

    xhr.send(targetFile);
}