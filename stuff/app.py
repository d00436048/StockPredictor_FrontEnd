from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import create_access_token, JWTManager
import sqlite3
import bcrypt

app = Flask(__name__)
CORS(app)
app.config["JWT_SECRET_KEY"] = "your_secret_key" #need fix this
jwt = JWTManager(app)

def get_db_connection():
    conn = sqlite3.connect('accounts.db')
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    with get_db_connection() as conn:
        conn.execute('''CREATE TABLE IF NOT EXISTS accounts (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        username TEXT NOT NULL UNIQUE,
                        email TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL,
                        salt Text NOT NULL,
                        stocks TEXT NOT NULL,
                        price_analysis INTEGER NOT NULL )''')
        
        conn.commit()

@app.route('/accounts/all', methods=['GET'])
def list_accounts():
    conn = get_db_connection()
    accounts = conn.execute('SELECT id, username, email FROM accounts').fetchall()
    conn.close()
    return jsonify([dict(account) for account in accounts])

@app.route('/accounts/login', methods=['POST'])
def login_account():
    data = request.json #get json from front end

    if not data["email"] or not data["password"]:
        return jsonify({"error": "no email or password"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute('SELECT id, username, password, salt, stocks, price_analysis FROM accounts WHERE email = ?', (data["email"],))
    account = cursor.fetchone()

    conn.close()

    if account:
        db_id, db_username, db_password, db_salt, db_stocks, db_price_analysis = account

        if bcrypt.checkpw(data['password'].encode('utf-8'), db_password): #might need to swap
            token = create_access_token(identity=db_id)
            return jsonify({"token": token, "username": db_username, "email": data["email"], "stocks": db_stocks, "price_analysis": db_price_analysis})
        else:
            return jsonify({"error": "password invalid"}), 401
    else:
        return jsonify({"error": "account not found"}), 404

@app.route('/accounts', methods=['POST'])
def create_account():
    data = request.json #get json from frontend

    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), salt)

    stocks = "AAPL"
    price_analysis = "34"

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('INSERT INTO accounts (username, email, password, salt, stocks, price_analysis) VALUES (?, ?, ?, ?, ?, ?)', (data['username'], data['email'], hashed_password, salt, stocks, price_analysis))
    account_id = cursor.lastrowid
    conn.commit()
    conn.close() #maybe make jwt token for security
    return jsonify({"message": "Accont craeted succesufely", "id": account_id, "username": data['username'], "email": data["email"], "stocks": stocks, "price_analysis": price_analysis}), 201

#login

#get data retreive

#store data put

#delete account delete

if __name__ == '__main__':
    init_db()
    app.run(debug=True)