from flask import Flask
from flask_cors import CORS
from backend.db import mysql
from backend.auth import auth
from backend.product_movement import  product_movement
from backend.locations import locations
from backend.products import  prodcuts
from dotenv import load_dotenv

import os
load_dotenv()

app = Flask(__name__)


app.config['MYSQL_HOST'] = os.getenv("MYSQL_HOST")
app.config['MYSQL_USER'] = os.getenv("MYSQL_USER")
app.config['MYSQL_PASSWORD'] = os.getenv("MYSQL_PASSWORD")
app.config['MYSQL_PORT'] = int(os.getenv("MYSQL_PORT"))
app.config['MYSQL_DB'] = os.getenv("MYSQL_DATABASE")   # <-- FIXED



CORS(
    app,
    resources={r"/api/*": {"origins": "http://localhost:3000"}},
    supports_credentials=True
)
mysql.init_app(app)

app.register_blueprint(auth, url_prefix="/api/auth")
app.register_blueprint(locations, url_prefix="/api/location")
app.register_blueprint(prodcuts , url_prefix="/api/product")
app.register_blueprint(product_movement , url_prefix="/api/product_movement")

@app.route("/")
def home():
    return {"message": "Flask API Running"}


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)

