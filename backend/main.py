from flask import Flask
from flask_cors import CORS
from backend.db import mysql
from backend.auth import auth
import os

from backend.locations import locations

app = Flask(__name__)

# MySQL configuration

app.config['MYSQL_HOST'] = "localhost"
app.config['MYSQL_USER'] = "root"
app.config['MYSQL_PASSWORD'] = "sql123"
app.config['MYSQL_DATABASE'] = "inventory_app"


CORS(app)
mysql.init_app(app)

# REGISTER BLUEPRINTS
app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(locations, url_prefix="/api/location")



@app.route("/")
def home():
    return {"message": "Flask API Running"}


if __name__ == "__main__":
    app.run(debug=True)
