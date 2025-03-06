function switchScene(sceneId) {
    document.querySelectorAll('.scene').forEach(scene => {
        scene.style.display = 'none';
    });
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
        window.location.replace("dashboard.html");
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
            window.location.replace("dashboard.html");
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