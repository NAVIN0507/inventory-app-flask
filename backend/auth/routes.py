import datetime

from flask import Blueprint, request, jsonify
import bcrypt
from backend.db import mysql
import jwt
from .jwt import verify_jwt
auth = Blueprint("auth", __name__)

# REGISTER
@auth.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    cursor = mysql.connection.cursor()

    # check if user exists
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    existing = cursor.fetchone()

    if existing:
        return jsonify({"message": "User already exists"}), 400

    # hash password
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    # insert user
    cursor.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (%s, %s, %s)",
        (name, email, hashed_password)
    )
    mysql.connection.commit()

    return jsonify({"message": "User registered successfully!"})


# LOGIN
@auth.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"message": "User not found"}), 404
    user_id = user[4]
    name = user[0]
    email = user[1]
    hashed = user[2]

    if not  bcrypt.checkpw(password.encode(), hashed.encode()):
        return jsonify({"message": "Invalid Password"})

    payload  = {
        "user_id" : user_id,
        "email":email,
        "exp":datetime.datetime.utcnow() +  datetime.timedelta(days=3)
    }

    token = jwt.encode(payload , "JWT_AUTH_SECRET" , algorithm="HS256")
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "user_id": user_id,
            "name": name,
            "email": email
        }
    })

@auth.route("/me", methods=["GET"])
def me():
    decoded, error_response, status = verify_jwt()
    if error_response:
        return error_response, status

    # decoded contains user_id and email from payload
    user_id = decoded["user_id"]

    cursor = mysql.connection.cursor()
    cursor.execute("SELECT user_id, name, email FROM users WHERE user_id = %s", (user_id,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"message": "User not found"}), 404

    return jsonify({
        "user_id": user[0],
        "name": user[1],
        "email": user[2]
        
    })