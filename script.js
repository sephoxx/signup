var storage = window.localStorage;
var subtext = document.getElementsByClassName('subText')[0];
var uniqueIP;




const handleSign = () => {
    const value = document.getElementsByClassName('nameInput')[0].value;
    const obj = {
        ip: uniqueIP,
        name: value
    }

    if (uniqueIP !== undefined) {
        axios.post('http://192.168.0.1:3000/setAuth', `ip=${uniqueIP}&name=${value}`).then(function(r){
            storage.setItem('key', JSON.stringify(obj))
            location.reload();
        })
    }
}

const handleAccess = (ip) => {
    const content = document.getElementsByClassName('text')[0]

    if (ip === '109.98.33.51' && storage.getItem('key') == null) {
        document.getElementById('accept').classList.remove('hidden');
        //storage.setItem('key', 'accessToken');
        //subtext.innerHTML = 'generated key succesfully!'

        content.innerHTML = `
            <div class="textDiv mainText">
             SIGN-UP
            </div>
            <div class="inputContainer" >
                <input class="nameInput"type="name" placeholder="Name"></input>
            </div>
            <div class="buttonContainer">
                <button class="button" onclick="handleSign()">CONTINUE</button>
            </div>
            <div class="buttonContainer">
                <button class="button red" onclick="storage.clear();location.reload()">DEBUG: DELETE STORAGE</button>
            </div>
        `

    } else if (storage.getItem('key') !== null) {
        document.getElementById('accept').classList.remove('hidden');
        const out = JSON.parse(storage.getItem('key'));
        content.innerHTML = `
            <div class="textDiv mainText">
                Name is ${out.name} and ip is ${ip}
            </div>
            <div class="buttonContainer">
                <button class="button red" onclick="storage.clear();location.reload()">DEBUG: DELETE STORAGE</button>
            </div>
        `
    } else {
        document.getElementById('accept').classList.add('hidden');

        document.getElementById('denied').classList.remove('hidden');
    }

    if (ip === '109.98.33.51' && storage.getItem('key') == null) {
        axios.get('http://192.168.0.1:3000/clients').then(function(response){
        const u = response.data.find( u => u.ip == uniqueIP) 
        if (u !== undefined) {
            const obj = {
                ip : u.ip,
                name: u.name
            }
            storage.setItem('key', JSON.stringify(obj));
            location.reload();
        }
     }).catch(function (error) {alert('test')});
    }

}

axios.get('http://api.ipify.org/?format=json').then(function (response) {
    handleAccess(response.data.ip);
}).catch(function (error) {
})

function getUserIP(onNewIP) { //  onNewIp - your listener function for new IPs
    //compatibility for firefox and chrome
    var myPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
    var pc = new myPeerConnection({
        iceServers: []
    }),
    noop = function() {},
    localIPs = {},
    ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g,
    key;

    function iterateIP(ip) {
        if (!localIPs[ip]) onNewIP(ip);
        localIPs[ip] = true;
    }

     //create a bogus data channel
    pc.createDataChannel("");

    // create offer and set local description
    pc.createOffer().then(function(sdp) {
        sdp.sdp.split('\n').forEach(function(line) {
            if (line.indexOf('candidate') < 0) return;
            line.match(ipRegex).forEach(iterateIP);
        });
        
        pc.setLocalDescription(sdp, noop, noop);
    }).catch(function(reason) {
        // An error occurred, so handle the failure to connect
    });

    //listen for candidate events
    pc.onicecandidate = function(ice) {
        if (!ice || !ice.candidate || !ice.candidate.candidate || !ice.candidate.candidate.match(ipRegex)) return;
        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
    };
}

// Usage

getUserIP(function(ip){
    uniqueIP = ip;
    //alert(uniqueIP);
});





