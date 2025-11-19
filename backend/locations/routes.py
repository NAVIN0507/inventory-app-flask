import datetime

from flask import Blueprint, request, jsonify
import bcrypt
from backend.db import mysql
import jwt
locations = Blueprint("locations", __name__)


@locations.route("/<user_id>" )
def getlocations(user_id):
    cursor =  mysql.connection.cursor()
    cursor.execute("SELECT * FROM locations where created_by = %s" , (user_id,))
    location  =  cursor.fetchall()
    if not  location:
        return jsonify({"Message" : "No Warehouse Found" , "location":0})
    allLoacations = []

    for x in location:
        allLoacations.append({
            "product_id":x[0],
            "name":x[1],
            "description":x[2],
        })
    return  jsonify({"locations" : allLoacations})

