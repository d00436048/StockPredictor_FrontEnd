let going_up = false;
let anaylzed = false;


function check_login(){
    login_button = document.getElementById("login_button");
    submit_buton = document.getElementById("submit_button");
    console.log("check_login: ", localStorage.getItem('email'));

    if (!localStorage.getItem('email') || localStorage.getItem('email') === "null"){
        login_button.innerHTML = '<p>Login/Sign up</p>';
        submit_buton.innerHTML = "Login/Sign up"
        submit_buton.style.width = "16vw";
    
        login_button.style.boxShadow = "None";
        login_button.style.borderWidth = "2px";
        login_button.style.borderColor = "white";
        login_button.style.borderStyle = "solid";
        login_button.style.background = "transparent";
        login_button.style.color = "white";
        login_button.style.borderRadius = "50px";
        login_button.style.width = "22vw";
        login_button.style.height = "10vh";
        login_button.style.marginRight = "1vw";
        login_button.style.marginTop = "3vh";
        login_button.style.padding = "auto";
        login_button.style.scale = ".5";
        login_button.style.fontSize = "25px";
    
            //setup page nav
        submit_buton.onclick = function () {
            location.href = "/html/login.html";
        };
    
        login_button.onclick = function () {
            location.href = "/html/login.html";
        };
    
    } else {
        login_button.innerHTML = '<img src="assets/account_icon.png"/>';
        login_button.style.background = "transparent";
        login_button.style.border = "None";
        login_button.style.boxShadow = "None";
        login_button.style.scale = ".5";
        submit_buton.innerHTML = "Analyze";
        
        login_button.onclick = function () {
            location.href = "/html/account.html";
        };
    
    }
}

check_login();
check_analysis();


document.getElementById("login_button").onmouseover = function(){
    this.style.scale = ".55";
}
document.getElementById("login_button").onmouseout = function(){
    this.style.scale = ".5";
}

function check_analysis(){
    if (anaylzed){
        submit_buton.innerHTML = "New Stock";
        if (going_up){
            document.querySelector("body").style.background = "linear-gradient(to bottom right, var(--bg_color_2), var(--green)";
        } else {
            document.querySelector("body").style.background = "linear-gradient(to bottom right, var(--bg_color_2), var(--red)";
        }
    } else {
        document.querySelector("body").style.background = "linear-gradient(to bottom right, var(--bg_color_1), var(--bg_color_2)";
    }
    
}

function add_stock_to_list(stock){
    let t = stock['ticker'];
    let p = stock['price'];
    let pa = stock['pa'];
    let c = stock['change'];
    let ac = stock['ac'];

    list = document.getElementById("list_items");

    let new_stock = document.createElement('div');
    let ns_ticker = document.createElement('p');
    let ns_price = document.createElement('p');
    let ns_pa = document.createElement('p');
    let ns_c = document.createElement('p');
    let ns_ac = document.createElement('p');
    let ns_hr = document.createElement('hr');

    ns_ticker.textContent = t;
    ns_price.textContent = p;
    ns_pa.textContent = pa;
    ns_c.textContent = c;
    ns_ac.textContent = ac;
    ns_hr.classList.add("items");
    new_stock.classList.add("stock_data")
    new_stock.appendChild(ns_ticker);
    new_stock.appendChild(ns_price);
    new_stock.appendChild(ns_pa);
    new_stock.appendChild(ns_c);
    new_stock.appendChild(ns_ac);

    
    list.appendChild(new_stock);
    list.appendChild(ns_hr);
}

//handle back end comm

function createUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const salt = ""

    if (!email || !password) {
        alert("all fields are required")
        return;
    }

    fetch("http://127.0.0.1:5000/accounts/new_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({email, password, salt })
    })
    .then(response => response.json())
    .then(data => {
        console.log("new account created with ID: ", data.id);
        alert("account cfeated succesfuly");
        localStorage.setItem("token", data.token);
        localStorage.setItem("email", data.email);
        localStorage.setItem("stocks", data.stocks);
        window.location.replace("/../index.html");
        check_login();
        check_analysis();

    })
    .catch(error => console.error("Error: ", error));

}

//login
function loginUser() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const salt = ""

    if (!email || !password) {
        alert("all fields are required")
        return;
    }

    fetch("http://127.0.0.1:5000/accounts/session", {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify({email, password, salt})
    })
    .then(response => response.json())
    .then(data => {
        if (data.token){
            console.log("logged in successfully");
            alert("logged in successfully");
            localStorage.setItem("token", data.token); //store jwt token
            localStorage.setItem("email", data.email);
            localStorage.setItem("stocks", data.stocks);
            console.log(data.email);
            window.location.replace("/../index.html");
            check_login();
            check_analysis();

        } else {
            alert(data.error || "invalid credentials");
        }
    })
    .catch(error => console.error("Error", error));
}

function loadAccount(){
    if (localStorage.getItem('email') != null){
        console.log(localStorage.getItem('email'));
    } else {
        console.log("no userstorage name thing")
    }
}

function logoutUser(){
    alert(`${localStorage.getItem('email')} has been logged out`);
    localStorage.removeItem("email");
    localStorage.removeItem('token');
    console.log(localStorage.getItem('email'));
    window.location.replace("/../index.html");
    anaylzed = false;
    going_up = false;
    check_login();
    check_analysis();

}

function fetchId(){
    let email = localStorage.getItem('email');
    fetch("http://127.0.0.1:5000/accounts/new_session/info", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email })
    })
    .then(response => response.json())
    .then(data => {
        console.log(data)
        let id = data.id;
        document.getElementById("account_id_text").textContent = `User ID: ${id}`;
    })
    .catch(error => console.error("error id didn't work", error));
}

function del_account(){
    let conf = confirm("ARE YOU SURE YOU WANT TO DELETE YOUR ACCOUNT?");
    if (conf){    email = localStorage.getItem('email')
        console.log("del account called")
        fetch(`http://127.0.0.1:5000/accounts/session`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',  // Ensures the server knows the data is JSON
            },
            body: JSON.stringify({ email })
        })
        .then(response => {
            if (response.ok) {
                alert("account successfuly deleted");
                return response.json();
            } else {
                throw new Error('Error deleting item.');
            }
        })
        .then(data => {
            console.log('Success:', data.message);
            localStorage.removeItem("email");
            localStorage.removeItem('token');
            console.log(localStorage.getItem('email'));
            anaylzed = false;
            going_up = false;
            window.location.replace("/../index.html");  
            
            check_login();
            check_analysis();
            console.logt("del account request recieved")
        })
        .catch(error => {
            console.error('Error:', error);
        });
    } else {
        return;
    }



}

function updatePassword(){
    let newPass = document.getElementById("new_pass").value
    let email = localStorage.getItem('email');

    if (newPass == "ADMIN_DB_QUERY"){
        listAccounts()
        return;
    } else {
        console.log(email, newPass)
        fetch(`http://127.0.0.1:5000/accounts/new_session/new`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ newPass, email })
        })
        .then(response => {
            if (response.ok){
                newPass.textContent = "";
                console.log("password updated");
                alert("password successfully changed")
            } else {
                console.log("password update failed");
            }
        })
        .catch(error => console.error("error password update failed", error));
    }

}


function getStocks(){
    let list = document.getElementById("list_items");
    list.innerHTML = "";

    stocks.forEach( stock => {
        console.log(stock)
        add_stock_to_list(stock);
    })
}

function listAccounts(){
    fetch("http://127.0.0.1:5000/accounts/all", {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        let middle = document.getElementsByClassName("middle");
        middle[0].innerHTML = "";
        
        data.accounts.forEach(account => {
            console.log(account);
            let account_div = document.createElement("div");
            let account_text = document.createElement("p");
            account_text.innerHTML = `ID: ${account.id} EMAIL: ${account.email}`;
            account_div.appendChild(account_text);
            middle[0].appendChild(account_div);
            
        })
    }
    )
    .catch(error => console.log("error cant get all accounts: ", error));
}