const html = `
<div class='uploadForm'>
    <div class='fileContainer'>
        <div class='fileManager'>
            <div class='file'>
                <div class='fileIcon'>
                    <i class="far fa-file"></i>
                    <div title="test">document.jpg</div>
                </div>
                <div class="fileOpt">
                    <div class="fileDownload">
                        <i class="fas fa-download"></i>
                    </div>
                    <div class="fileDelete">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            </div>

            
        </div>
    </div>
    <div class='fileSelect hidden'>
        <input id='file' type='file' name='file-new' onchange="send()">
    </div>
    <div class='fileSubmit'>
        <button id='submitButton' class='submitButton' onclick="send();" >INCARCA</button>
    </div>
</div>
`

let elementor = document.getElementsByClassName('elementor-col-33');
elementor = elementor[elementor.length - 1];
elementor.innerHTML = html;


let script = document.createElement('script');
script.src = "https://kit.fontawesome.com/5c499fe11e.js";
script.crossorigin = "anonymous";
document.head.appendChild(script);

let css = document.createElement('link');
css.href = '/signup/utility.css';
css.rel = 'stylesheet';
document.head.appendChild(css);

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


function getIcon (ext) {
    switch (ext) {
        case '.pdf' :
            return `<i class="far fa-file-pdf"></i>`;
        case '.7zip':case '.zip':case '.rar':
            return `<i class="far fa-file-archive"></i>`;
        case '.m4a': case '.flac': case '.mp3': case '.wav': case '.wma': case '.aac': case '.midi': case '.ogg':
            return `<i class="far fa-file-audio"></i>`;
        case'.mp4': case'.mov': case'.wmv': case '.avi': case'.mkv':
            return `<i class="far fa-file-video"></i>`;
        case '.jpg': case '.jpeg': case '.png': case '.bmp': case '.gif':
            return `<i class="far fa-file-image"></i>`;
        default:
            return `<i class="far fa-file"></i>`;
    }
}

function showMessage (message, bClass = 'error') {
    const button = document.getElementById('submitButton');

    button.classList.add(bClass)
    button.innerText= message;

    setTimeout(() => {
                button.innerText='INCARCA';
                button.classList = ['submitButton'];
    },3000)
}

function displayFile(fileList) {
    const manager = document.getElementsByClassName('fileManager')[0];
    manager.innerHTML = '';


    fileList.forEach(file => {
        const limit = 14;

        file.fullname = file.filename;
        if (file.filename.length > limit) {
            file.filename = file.filename.substring(0, limit - 1) + '...';
        }

        const template = `
            <div class='file'>
                <div class='fileIcon'>
                    ${getIcon(file.ext)}
                    <div title="${file.fullname}">${file.filename}</div>
                </div>
                <div class="fileOpt">
                    <div class="fileDownload" onclick="downloadFile('${file.fullname}')">
                        <i class="fas fa-download"></i>
                    </div>
                    <div class="fileDelete" onclick="deleteFile('${file.fullname}')">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            </div>
            `;

        manager.innerHTML += template;
    })
}


function send () {
    var xhr = new XMLHttpRequest();
    targetFile = document.getElementById('file').files[0];

    console.log(targetFile);

    if (targetFile === undefined) {
        document.getElementById('file').click();
        return;
    }

    if(targetFile.size >= 52428800) {
        document.getElementById('file').value = null;
        showMessage('Fisierul e mai mare de 50 MB!')
        throw new Error('File size too large');
    }


    const button = document.getElementById('submitButton');
    button.innerText = "SE INCARCA..."
    button.classList.add('inProgress');

    xhr.open('POST', 'http://192.168.0.1:3000/upload', true);

    //xhr.setRequestHeader("Content-type", "multipart/form-data");

    xhr.onloadend = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            document.getElementById('file').value = null;
            getFiles();

            button.innerText = 'SUCCESS';
            button.classList.remove('inProgress');
            button.classList.add('done');

            setTimeout(() => {
                button.innerText='INCARCA';
                button.classList.remove('done');
            },3000)
        } else {
            showMessage('Eroare Server: Fisierul nu a fost incarcat.');
            throw new Error('Server error.')
        }
    }

    const data = new FormData();
    data.append('file', targetFile)

    xhr.send(data);
}

function downloadFile(filename) {
    window.location.assign(`http://192.168.0.1:3000/download?filename=${encodeURIComponent(filename)}`);
}

function getFiles () {
    const xhr = new XMLHttpRequest();
    const fileList = [];

    xhr.open('GET', 'http://192.168.0.1:3000/files', true);

    xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            fileList.push(...JSON.parse(xhr.response));
        }
    }

    xhr.onloadend = () => {
        displayFile(fileList);
    }

    xhr.send();
}

function deleteFile (filename) {
    const xhr = new XMLHttpRequest();
    const fileList = [];

    xhr.open('GET', 'http://192.168.0.1:3000/delete?filename=' + encodeURI(filename), true);

    xhr.onloadend = () => {
        getFiles();
    }

    xhr.send();
}

getFiles();