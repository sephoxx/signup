var owner = ['Gradinita 122', 'Gradinitei 122'] //change this depending on school

var storage = window.localStorage;
// Preload

document.getElementsByClassName('titleText')[0].innerHTML = owner[0];
document.getElementsByClassName('replace')[0].innerHTML= owner[1];
document.getElementsByClassName('replace')[1].innerHTML= owner[0];

// Post-Authentication

// Main

const handleSwitch = (isLogin = false) => {
    const form = document.getElementsByClassName('form')[0];
    const formSwitch = document.getElementById('switch');
    
    if (isLogin) {
        form.innerHTML = `
        <div class="inputContainer">
        <div class="label">Nume si prenume parinte:</div>
        <input type="name" class="formInput" placeholder="numele si prenumele"></input>
        </div>
        <div class="inputContainer">
        <div class="label">Clasa/grupa la care este inscris copilul :
        </div>
        <input type="text" class="formInput" placeholder="denumire"></input>
        </div>
        <div class="inputContainer">
        <div class="label">Adresa de email:</div>
        <input type="email" class="formInput" placeholder="email"></input>
        </div>
        <div class="inputContainer">
        <div class="label">Parlola:</div>
        <input type="password" class="formInput" placeholder="parola"></input>
        </div>
        <div class="inputContainer">
        <div class="label">Confirmare Parola:</div>
        <input type="password" class="formInput" placeholder="confirmare parola"></input>
        </div>
        <div class="inputContainer">
        <div class="label">Acord de informare digitala:</div>
        <textarea type="text" class="formInput textArea" placeholder="sunt de acord cu informarea in sistem digital in proximitatea Unitatii Scolare"></textarea>
        </div>
        <div class="inputContainer">
        <button class="sendBtn" onclick="handleSign()"><b>Send</b></button>
        </div>
        `

        formSwitch.setAttribute('onclick', 'handleSwitch()');
        formSwitch.innerText = 'Ai cont? Apasa aici.';
    } else {
        form.innerHTML = `
        <div class="inputContainer">
        <div class="label">Email:</div>
        <input type="email" class="formInput" placeholder="email"></input>
        </div>
        <div class="inputContainer">
        <div class="label">Parola:</div>
        <input type="password" class="formInput" placeholder="parola"></input>
        </div>
        <div class="inputContainer">
        <button class="sendBtn" onclick="loginSubmit()"><b>Log-in</b></button>
        </div>        
        `

        formSwitch.setAttribute('onclick', 'handleSwitch(true)');
        formSwitch.innerText = 'Nu ai cont? Apasa aici.';
    }
}

handleSwitch();

const handleSign = () => {
    const inputs = document.getElementsByClassName('formInput');
    let ok = true;

    Array.from(inputs).forEach(i => {
        if (i.value === "") {
            ok = false;
        }   
    })

    if (inputs[3].value.length < 7) {
        ok = false;
        alert('Parola prea scurta ( minim 7 caractere )');
        return;
    }

    if (ok) {
        initAuth(inputs);
    } else {
        alert('Te rugam sa completezi toate campurile');
        return;
    }
}

const loginSubmit = () => {
    inputs = document.getElementsByClassName('formInput');
    const data = {
        email: inputs[0].value,
        password: btoa(inputs[1].value)
    }

    console.log(data);

    handleLogin(data);
}

const handleLogin = (data = {}) => {
    console.log(data)
    axios.post('http://192.168.0.1:3000/login', `email=${data.email}&password=${data.password}`).then(function (response) {
        storage.setItem('credentials', JSON.stringify(data));
        window.location = `http://${location.hostname}/page`;
    }).catch(function (error) {
        alert("Datele introduse sunt gresite.");
        console.log(error);
    });
}

const initAuth = (inputs = []) => {

    let ok = checkPassword(inputs[3].value, inputs[4].value);

    if (ok) {
        let obj = {
            name: inputs[0].value,
            childClass : inputs[1].value,
            email: inputs[2].value,
            password: checkPassword(inputs[3].value, inputs[4].value),
            gdpr: inputs[5].value
        }
    
        axios.post('http://192.168.0.1:3000/setAuth', `name=${obj.name}&email=${obj.email}&password=${obj.password}`).then(function (respone) {
            storage.setItem('credentials', JSON.stringify(obj));
        }).catch(function (error) {
            if (error.response.status === 400) {
                alert('Adresa de email a fost deja folosita');
            } else {
                alert ('Server inaccesibil');
            }

        });
        alert('sent!');
        location.reload();
    }
}

const checkPassword = (pass, conf) => {
    if (pass !== conf)  {
        alert('Confirmarea parolei esuata');
        return false;
    }
    else
        return btoa(pass);

} 


// Standalone

if (storage.getItem('credentials') !== null) {
    const data = storage.getItem('credentials');
    console.log(data);
    handleLogin(JSON.parse(data));
}
