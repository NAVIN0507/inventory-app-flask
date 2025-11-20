from flask import Flask
from flask_cors import CORS
from backend.db import mysql
from backend.auth import auth
from backend.product_movement import  product_movement
from backend.locations import locations
from backend.products import  prodcuts
from backend.ai_agent import  ai_chat

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
app.register_blueprint(prodcuts , url_prefix="/api/product")
app.register_blueprint(product_movement , url_prefix="/api/product_movement")
app.register_blueprint(ai_chat , url_prefix="/api/ai_chat")

@app.route("/")
def home():
    return {"message": "Flask API Running"}


if __name__ == "__main__":
    app.run(debug=True)
