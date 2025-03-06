function switchScene(sceneId) {
    document.querySelectorAll('.scene').forEach(scene => {
        scene.style.display = 'none';
    });
    let current_scene = document.getElementById(sceneId).style.display = 'flex';
    if (sceneId == 'dashboard-scene'){
        loadDash();
    }
}

//handle create account
function createUser() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const salt = ""

    if (!username || !email || !password) {
        alert("all fields are required")
        return;
    }

    fetch("http://127.0.0.1:5000/accounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, salt })
    })
    .then(response => response.json())
    .then(data => {
        console.log("new account created with ID: ", data.id);
        alert("account cfeated succesfuly");
        localStorage.setItem("user", data.username);
        localStorage.setItem("email", data.email);
        localStorage.setItem("stocks", data.stocks);
        localStorage.setItem("price_analysis", data.price_analysis)
        switchScene('dashboard-scene');
    })
    .catch(error => console.error("Error: ", error));

}

//login
function loginUser() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const salt = ""

    if (!email || !password) {
        alert("all fields are required")
        return;
    }

    fetch("http://127.0.0.1:5000/accounts/login", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({email, password, salt})
    })
    .then(response => response.json())
    .then(data => {
        if (data.token){
            console.log("logged in succuseflyy");
            alert("logged in succuseflyy");
            localStorage.setItem("token", data.token); //store jwt token
            localStorage.setItem("user", data.username); //can check whats in storage and use it to load account
            localStorage.setItem("email", data.email);
            localStorage.setItem("stocks", data.stocks);
            localStorage.setItem("price_analysis", data.price_analysis);
            console.log(data.username);
            switchScene('dashboard-scene');
        } else {
            alert(data.error || "invalid credentials");
        }
    })
    .catch(error => console.error("Error", error));
}
//retreive data

//store data put

//delte account

//list

function loadDash(){

    if (localStorage.getItem('user') != null){
        console.log(localStorage.getItem('user'))
        account_header = document.getElementById("DASH-account-name");
        account_header.textContent = localStorage.getItem('user');

        let stocks = localStorage.getItem("stocks");
        let price_analysis = localStorage.getItem("price_analysis");
        if (!stocks){
            console.log("no stocks");
            return;
        }
        if (!tables){
            console.log("no price_analysis");
            return;
        }
        try { 
            console.log("try");
    } catch (error){
        console.error("error parsing countbys: ", error);
    }

    } else {
        console.log("no userstorage name thing")
    }
}

function loadAccount(){
    if (localStorage.getItem('user') != null){
        console.log(localStorage.getItem('user'));
        account_header = document.getElementById("ACCOUNT-account-name");
        email_header = document.getElementById("ACCOUNT-email");
        account_header.textContent = localStorage.getItem('user');
        email_header.textContent = localStorage.getItem('email')
    } else {
        console.log("no userstorage name thing")
    }
}

function logout(){
    localStorage.setItem('user', null);
    localStorage.setItem("email", null);
    localStorage.setItem('token', null);
    switchScene("splash-scene")
    console.log(localStorage.getItem('user'))
}

function startCountBys(integer) {
    body = document.getElementById("COUNTBY-body");
    body.innerHTML = "";

    let iterator = 0;
    let cm = integer;

    let countbyScene = document.getElementById("countby-scene");


    countbyScene.addEventListener('click', function(){
        if (iterator < 12){
            cm = integer*iterator;
            console.log(cm);
            let num = document.createElement("text");
            num.textContent = `${cm}`;
            if (!body.contains(num)){
                body.appendChild(num);
                iterator++;
            }
        } else {
            let button = document.createElement("button");
            button.id = "COUNTBY-finishbutton";
            iterator = 0;
            body.innerHTML = ""
            body.appendChild(button);
            button.onclick = function() {
                switchScene("dashboard-scene");
                return;
            };
            console.log("finished countbys");
        }
    })


}