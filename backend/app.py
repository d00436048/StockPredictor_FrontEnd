from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
import sqlite3
import bcrypt
import json
import yfinance as yf

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "your_secret_key" #need fix this
jwt = JWTManager(app)


# Add this line to enable CORS on all routes
CORS(app, origins="*", methods=["GET", "POST", "OPTIONS", "PUT", "DELETE"], supports_credentials=True)


def get_db_connection():
    conn = sqlite3.connect('accounts.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db_connection() as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS accounts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        email TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        salt Text NOT NULL,
                        stocks TEXT NOT NULL)''')
        
        conn.commit()

@app.route('/accounts/all', methods=['GET'])
def list_accounts():
    account_list = []
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM accounts')
    accounts = cursor.fetchall()
    for account in accounts:
        account_dict = dict(account)

        for key, value in account_dict.items():
            if isinstance(value, bytes):
                account_dict[key] = value.decode("utf-8")
        account_list.append(account_dict)

    conn.close()
    print(account_list)
    return jsonify({"accounts": account_list}), 200

@app.route('/accounts/session', methods=['POST'])
def login_account():
    data = request.json #get json from front end

    if not data["email"] or not data["password"]:
        return jsonify({"error": "no email or password"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT id, email, password, salt, stocks FROM accounts WHERE email = ?', (data["email"],))
    account = cursor.fetchone()

    conn.close()

    if account:
        db_id, db_email, db_password, db_salt, db_stocks = account

        if bcrypt.checkpw(data['password'].encode('utf-8'), db_password): #might need to swap
            token = create_access_token(identity=db_id)
            return jsonify({"token": token, "email": data["email"], "stocks": db_stocks})
        else:
            return jsonify({"error": "password invalid"}), 401
    else:
        return jsonify({"error": "account not found"}), 404
    
@app.route('/accounts/new_session/new', methods=['POST'])
def update_pass():
    data = request.json

    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(data['newPass'].encode('utf-8'), salt)

    conn = get_db_connection()
    conn.execute("UPDATE accounts SET password = ?, salt = ? WHERE email = ?", (hashed_password, salt, data['email']))
    conn.commit()
    conn.close()
    return jsonify({"message": "password updated successfully"}), 200

@app.route('/accounts/new_session/info', methods=['POST'])
def return_id():
    data = request.json

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM accounts WHERE email = ?", (data['email'],))
    id = cursor.fetchone()
    id = id[0]
    conn.close()

    print(id)

    return jsonify({"message": "password updated successfully", "id": id}), 200

@app.route('/accounts/new_session', methods=['POST'])
def create_account():
    data = request.json #get json from frontend

    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), salt)

    stocks = json.dumps([
        {
        "ticker": "AAPL",
        "price": "$175.23",
        "change": "+2.15%",
        "volume": "56.2M",
        "market_cap": "2.76T",
        "pe_ratio": "29.5",
        "div_yield": "0.55%"
        }
    ])

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO accounts (email, password, salt, stocks) VALUES (?, ?, ?, ?)', (data['email'], hashed_password, salt, stocks))
    account_id = cursor.lastrowid
    conn.commit()
    conn.close() #maybe make jwt token for security
    token = create_access_token(identity=account_id)
    return jsonify({"message": "Accuont created successfully", "token": token ,"id": account_id, "email": data["email"], "stocks": stocks}), 201


@app.route('/accounts/session', methods=["DELETE"])
def del_account():
    data = request.json

    email = data.get("email")

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM accounts where email = ?', (email,))
    conn.commit()
    if cursor.rowcount > 0:
        # Account successfully deleted
        return jsonify({"message": f"Account with email {email} deleted successfully."}), 200
    else:
        # Account not found
        return jsonify({"error": "Account not found"}), 404



if __name__ == '__main__':
    init_db()
    app.run(debug=True)