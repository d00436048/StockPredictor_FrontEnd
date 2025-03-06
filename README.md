# s25-resourceful-d00436048

## Resource Name: accounts

## Resource Attributes:
- id
- email
- password "hased using bcrypt with salt"
- salt
- stocks

## DATABASE SCHEMA
SQLite 'CREATE TABLE' for the **accounts** resource:

'''CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      salt Text NOT NULL,
      stocks TEXT NOT NULL)

## Endpoints:
- path: /accounts/all
- method: GET
- name: list_accounts
--------------------------------------
- path: /accounts/session
- method: POST
- name: login_account
--------------------------------------
- path: /accounts/new_session/new
- method: POST
- name: update_pass
--------------------------------------
- path: /accounts/new_session/info
- method: DELETE
- name: del_account
--------------------------------------
-path: /accounts/new_session
-method: POST
-name: create_account
--------------------------------------
-path: /accounts/session
-method: GET
-name: list_accounts