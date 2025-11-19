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
            "address":x[2],
        })
    return  jsonify({"locations" : allLoacations})

@locations.route("/addlocation/<user_id>" , methods=["POST"])
def addLocation(user_id):
    data  = request.json
    name = data.get("name")
    address = data.get("address")
    image_url =  data.get("image_url")
    cursor = mysql.connection.cursor()
    sql = 'INSERT INTO  locations (name , address , created_by ,image_url) VALUES (%s , %s , %s , %s)'
    cursor.execute(sql , (name , address , user_id , image_url))
    mysql.connection.commit()
    return jsonify({"message": "Location added  successfully!"})

@locations.route("/updatelocation/<location_id>", methods=["PUT"])
def update_location(location_id):
    data = request.json
    name = data.get("name")
    address = data.get("address")
    image_url = data.get("image_url")

    cursor = mysql.connection.cursor()

    cursor.execute("SELECT * FROM locations WHERE location_id = %s", (location_id,))
    existing = cursor.fetchone()

    if not existing:
        return jsonify({"message": "Location not found"}), 404

    sql = """
        UPDATE locations 
        SET name = %s, address = %s, image_url = %s
        WHERE location_id = %s
    """

    cursor.execute(sql, (name, address, image_url, location_id))
    mysql.connection.commit()

    return jsonify({"message": "Location updated successfully!"})

@locations.route("/deletelocation/<location_id>" , methods=["DELETE"])
def deleteLocation(location_id):
    cursor = mysql.connection.cursor()

    cursor.execute("SELECT * FROM locations WHERE location_id = %s", (location_id,))
    existing = cursor.fetchone()

    if not existing:
        return jsonify({"message": "Location not found"}), 404
    sql = "DELETE  from locations where location_id = %s"
    cursor.execute(sql , (location_id , ))
    mysql.connection.commit()

    return  jsonify({"message":"Location Deleted Successfully"})