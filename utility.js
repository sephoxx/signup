const html = `
<div class='uploadForm' ondrop="handleDrop(event)" ondragover="handleDrag(event)" ondragenter="handleDragEnter(event)" ondragleave="handleDragLeave(event)">
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
<div class='sizeContainer'>
    si dvs. puteti afisa pe ID4K!
</div>
<div class='fileSelect hidden'>
    <input id='file' type='file' name='file-new' onchange="send()">
</div>
<div class='fileSubmit'>
    <button id='submitButton' class='submitButton' onclick="send();" >incarca pe ID4K!</button>
</div>
</div>
`




const types = ['.jpg', '.png', '.bmp', '.gif', '.jpeg'];
let totalSize;
const sizeLimit = 500;
let dragCounter = 0;


let script = document.createElement('script');
script.src = "https://kit.fontawesome.com/5c499fe11e.js";
script.crossorigin = "anonymous";
document.head.appendChild(script);

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

function handleDragEnter(ev) {
    console.log('enter')

    if (ev.dataTransfer.items) {
        Array.from(ev.dataTransfer.items).forEach(file => {
            if (file.kind === 'file') {
                const window = document.getElementsByClassName('fileContainer')[0];
                
                window.classList.add('blur');
                dragCounter++;
            }
        })
    }
}

function handleDragLeave(ev) {
    dragCounter--;
    console.log('leave')
    if (ev.dataTransfer.items) {
        Array.from(ev.dataTransfer.items).forEach(file => {
            if (file.kind === 'file'  && dragCounter === 0) {
                const window = document.getElementsByClassName('fileContainer')[0];
                
                window.classList.remove('blur');
            }
        })
    }
}

function handleDrag (ev) {
    ev.preventDefault();
}

function handleDrop (ev) {
    console.log('Files Dropped!')
    ev.preventDefault();
    dragCounter = 0;
    const window = document.getElementsByClassName('fileContainer')[0];
                
    window.classList.remove('blur');



    if (ev.dataTransfer.items) {
        Array.from(ev.dataTransfer.items).forEach(file => {
            if (file.kind === 'file') {
                const outFile = file.getAsFile();
                send(outFile); 
            }
        })
    } else {
        throw new Error('Dragged data is not a file');
    }
}

function getMB (size) {
    return size / Math.pow(1024,2);
}

function setSize (size) {
    const bar = document.getElementById('progressBar');     
    const info = document.getElementsByClassName('sizeInfo')[0];

    size = getMB(size);
    let percent = ( size / sizeLimit ) * 100;

    bar.style.width = `${percent}%`;
    info.innerText = `${size.toFixed(2)}Mb / ${sizeLimit}Mb ( ${percent.toFixed(0)}% )`;
    console.log(size, percent);
}

function getIcon (ext , filename, index) {
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
            return `<div class='spacer'></div>`;
        default:
            return `<i class="far fa-file"></i>`;
    }
}

function handlePhoto (filename, index) {
    const file = document.getElementsByClassName('file')[index];
    
    file.style.backgroundImage = `linear-gradient(to top, rgba(255,255,255, 1) 0%, rgba(0,0,0, 0) 120%), url('http://gradinita122.live/uploads/${currentGroup}/${encodeURI(filename)}?${Math.round(Math.random() * 10000)}}') `;
    file.style.backgroundPosition = 'center';
    file.style.backgroundSize = 'cover';


}

function unfocus () {
    const tmp = document.createElement('button');
    tmp.classList.add('hidden');
    tmp.focus()
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

function limitName (limit, name) {
    if (name.length > limit) {
            name = name.substring(0, limit - 1) + '...';
        }
    
    return name;
}

function displayFile(fileList) {
    const manager = document.getElementsByClassName('fileManager')[0];
    manager.innerHTML = '';

    fileList.forEach((file, index) => {
        const charLimit = 14;
        
        file.fullname = file.filename;
        

        const template = `
            <div class='file'>
                <div class='fileIcon' onclick='setModal("${file.fullname}", "${file.ext}")'>
                    ${getIcon(file.ext)}
                    <div title="${file.fullname}">${limitName(charLimit, (file.filename.split('~')[1] !== undefined ? file.filename.split('~')[1] : file.filename))}</div>
                </div>
                <div class="fileOpt">
                    <div class="fileDownload" onclick="downloadFile('${file.fullname}')">
                        <i class="fas fa-download"></i>
                    </div>
                    <div class="fileDelete ${storage.email === file.fullname.split('~')[0] ? '' : 'unauthorized'}" onclick="deleteFile('${file.fullname}')">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
            </div>
            `;

        manager.innerHTML += template;
        types.find(type => type === file.ext) ? handlePhoto(file.fullname, index) : null;
    })

}

function send (file) {
    var xhr = new XMLHttpRequest();
    targetFile = document.getElementById('file').files[0];

    console.log(targetFile);

    if (targetFile === undefined && file === undefined) {
        document.getElementById('file').click();
        return;
    } else if (file !== undefined) {
        targetFile = file;
    }

    if(targetFile.size >= 52428800) {
        document.getElementById('file').value = null;
        showMessage('Fisierul e mai mare de 50 MB!')
        throw new Error('File size too large');
    }

    if (getMB(targetFile.size + totalSize) >= sizeLimit) {
        document.getElementById('file').value = null;
        showMessage('Server-ul nu mai are spatiu de stocare!');
        throw new Error('Server storage limit hit!');
    }
        


    const button = document.getElementById('submitButton');
    unfocus();
    button.innerText = "se incarca..."
    button.classList.add('inProgress');

    xhr.open('POST', 'http://192.168.0.1:3000/upload', true);

    //xhr.setRequestHeader("Content-type", "multipart/form-data");

    xhr.onloadend = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
            document.getElementById('file').value = null;

            getFiles();

            button.innerText = 's-a incarcat!';
            button.classList.remove('inProgress');
            button.classList.add('done');

            setTimeout(() => {
                button.innerText='incarca pe ID4K!';
                button.classList.remove('done');
            },3000)
        } else {
            showMessage('Eroare Server: Fisierul nu a fost incarcat.');
            throw new Error('Server error.')
        }
    }

    const data = new FormData();
    const fieldData = {
        group: currentGroup,
        email: storage.email
    }
    data.append('field', JSON.stringify(fieldData));
    data.append('file', targetFile);
    

    xhr.send(data);
}

function downloadFile(filename) {
    window.location.assign(`http://192.168.0.1:3000/download?filename=${encodeURIComponent(filename)}&group=${currentGroup}`);
}

function getFiles () {
    const xhr = new XMLHttpRequest();
    const fileList = [];

    xhr.open('GET', `http://192.168.0.1:3000/files?group=${currentGroup}`, true);

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

    xhr.open('GET', `http://192.168.0.1:3000/delete?filename=${encodeURI(filename)}&group=${currentGroup}`, true);

    xhr.onloadend = () => {
        getFiles();
    }

    xhr.send();
}

function deleteModal () {
    document.getElementById('modal').remove();
}

window.addEventListener('click', e => {
    if (e.target.getAttribute('id') === 'modal') {
        deleteModal();
    }
})

window.addEventListener('touchend', e => {
    if (e.target.getAttribute('id') === 'modal') {
        deleteModal();
    }
})

function setModal (content, ext) {
    let parser;
    let type;

    switch (ext) {
        case '.pdf' :
            type = `pdf`;
            break;
        case '.7zip':case '.zip':case '.rar':
            type = `zip`;
            break;
        case '.m4a': case '.flac': case '.mp3': case '.wav': case '.wma': case '.aac': case '.midi': case '.ogg':
            type = `aud`;
            break;
        case'.mp4': case'.mov': case'.wmv': case '.avi': case'.mkv': case '.mpeg':
            type = `vid`;
            break;
        case '.jpg': case '.jpeg': case '.png': case '.bmp': case '.gif':
            type = `img`;
            break;
        case '.docx': case '.xlsx':
            type = 'doc';
            break;
        default:
            type = `file`;
            break;
    }

    console.log(type);

    

    switch (type) {
        case 'img':
            parser = `<img src='http://gradinita122.live/uploads/${currentGroup}/${encodeURI(content)}?#id='`;
            break;
        case 'vid':
            parser = `<video width='100%' controls> <source src='http://gradinita122.live/uploads/${currentGroup}/${encodeURI(content)}?#id='> </video>`
            break;
        case 'aud':
            parser = `<audio controls src='http://gradinita122.live/uploads/${currentGroup}/${encodeURI(content)}?#id='></audio>`
            break;
        case 'doc':
            parser = `<iframe src="https://view.officeapps.live.com/op/embed.aspx?src=http://gradinita122.live/uploads/${currentGroup}/${encodeURI(content)}"></iframe>`;
            break;
        default:
            throw new Error('Unexpected file type.');
            return;
    }

    const html = document.createElement('div');
    html.classList.add('modalContainer')
    html.setAttribute('id', 'modal');

    
    html.innerHTML = `
        <div class='modalContainer' id='modal'>
            <div class="content">
                ${parser}
            </div>
        </div>
    `
    document.body.insertBefore(html, document.body.firstChild);
    }


function initOnline() {
    const html = `
    <div class='onlineContainer'>
        <div class="userContainer">
            <div class="userLabel atime">In:</div>

            <marquee id='online'></marquee>
        </div>
        <div class="userContainer">
            <div class="userLabel itime">Out:</div>
            <marquee id='offline'></marquee>
            <!-- <div class="userLabel">In:</div> -->
        </div>
    </div>
    `

    const section = document.getElementsByClassName('elementor-section-wrap')[0];
    const spot = section.getElementsByTagName('section')[0];

    const out = document.createElement('div');
    out.classList.add('onlineContainer');
    out.innerHTML = html;

    spot.insertAdjacentElement('afterend',out);
}


    function setOnline (log) {
        let online = document.getElementById('online');
        let offline = document.getElementById('offline');
        online.innerHTML = '';
        offline.innerHTML = '';
        
        console.log(log)
        log.active.forEach(user => {
            const timestamp = new Date(user.timestamp)
            const out = `
            <span class='user'>
                <span class='apoint'>•</span>
                <span class='userName'>${user.name}<span class='timestamp atime'>${parseTime(timestamp)}</span></span>
            </span>`
            user !== null ? online.innerHTML += out : null;
            
        })

        log.inactive.forEach(user => {
            timestamp = new Date(user.timestamp);
            const out = `
            <span class='user'>
                <span class='apoint ipoint'>•</span>
                <span class='userName'>${user.name}<span class='timestamp itime'>${parseTime(timestamp)}</span></span>
            </span>`
            user !== null ? offline.innerHTML += out : null;
        })

    }


    function initWS () {
        let ws = new WebSocket('ws://192.168.0.1:3001');
        let userLog;

        ws.onopen = () => console.log('[*] WS OPENED');
        ws.onclose = () => {
            console.log('[*] WS CLOSED')
            initWS();
        };

        ws.onmessage = e => {
            const message = JSON.parse(e.data);

            if (message !== undefined) {
                userLog = message;
                setOnline(userLog);
                console.log(userLog);
            }
        }

        const storage = JSON.parse(window.localStorage.getItem('credentials'));

        const outbound = {
            action: 'initialize',
            name: storage.email
        }

        function wsSend(outbound) {
            if (ws.readyState === 1) {
                ws.send(outbound);
            }
            else {
                setTimeout(() => {wsSend(outbound)}, 100);
            }
        }

        wsSend(JSON.stringify(outbound));
    }

    

    const injection = () => {
        let elementor = document.getElementsByClassName('elementor-col-33');
        elementor = elementor[elementor.length - 1];
        elementor.innerHTML = html;
        
        
        getFiles();
        initOnline();
        initWS();
    }

    setTimeout(injection, 500);