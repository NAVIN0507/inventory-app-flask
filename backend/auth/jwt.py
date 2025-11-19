import jwt
import os
from flask import request, jsonify

def verify_jwt():
    auth_header = request.headers.get("Authorization")

    if not auth_header:
        return None, jsonify({"message": "Missing Authorization header"}), 401

    try:
        scheme, token = auth_header.split()
        if scheme.lower() != "bearer":
            return None, jsonify({"message": "Invalid auth scheme"}), 401

        decoded = jwt.decode(
            token,
            "JWT_AUTH_SECRET",
            algorithms=["HS256"]
        )
        return decoded, None, None

    except jwt.ExpiredSignatureError:
        return None, jsonify({"message": "Token expired"}), 401

    except Exception as e:
        return None, jsonify({"message": "Invalid token"}), 401
