from flask import Blueprint, request, jsonify

from db import mysql

prodcuts = Blueprint("products", __name__)

@prodcuts.route("/getproductsbylocation/<location_id>")
def getproductbylocation(location_id):
    cursor = mysql.connection.cursor()
    sql = "SELECT * from products where located_in = %s"
    cursor.execute(sql , (location_id,))
    items =  cursor.fetchall()
    if not items:
        return  jsonify({"message":"No product to be found on this location" , "product":0})
    productsbylocation = []
    for item in items:
        productsbylocation.append({
            "product_id":item[0],
            "name":item[1],
            "description":item[2],
            "image_url":item[6],
            "qty":item[3]
        })
    return jsonify({"message":"Products from location" , "products" : productsbylocation})

@prodcuts.route("/getproductsbyuser/<user_id>")
def getProductbyUserId(user_id):
    cursor = mysql.connection.cursor()
    sql = "select * from products p  inner join locations l on p.located_in = l.location_id where p.created_by =  %s order by p.created_at desc"
    cursor.execute(sql, (user_id,))
    items = cursor.fetchall()
    if not items:
        return jsonify({"message": "No product to be found on this location", "product": 0})
    sql = "select count(*) from products where created_by = %s"
    cursor.execute(sql , (user_id,))
    product_count = cursor.fetchone()

    productsbyusers = []
    for item in items:
        productsbyusers.append({
            "product_id": item[0],
            "name": item[1],
            "description": item[2],
            "image_url": item[6],
            "qty":item[3],
            "location_name":item[9],
            "location_address":item[10],
            "location_img_url":item[11]
        })

    return jsonify({ "products": productsbyusers , "product_count":product_count[0] })

@prodcuts.route("/getproductbyId/<product_id>")
def getProductbyId(product_id):
    cursor = mysql.connection.cursor()
    sql = "select * from products p  inner join locations l on p.located_in = l.location_id where p.product_id =  %s"
    cursor.execute(sql, (product_id,))
    items = cursor.fetchall()
    if not items:
        return jsonify({"message": "No product to be found on this location", "product": 0})
    productByID = []
    for item in items:
        productByID.append({
            "name": item[1],
            "description": item[2],
            "image_url": item[6],
            "qty":item[3],
            "location_name": item[9],
            "location_address": item[10],
            "location_img_url": item[11]
        })

    return jsonify({"message": "Products from location by Id", "products": productByID[0]})
@prodcuts.route("/addProduct/<user_id>" , methods=["POST"])
def addProductById(user_id):
    data = request.json
    name = data.get("name")
    description = data.get("description")
    created_by = user_id
    located_in = data.get("located_in")
    image_url = data.get("image_url")
    qty =  data.get("qty")
    cursor = mysql.connection.cursor()
    sql = "INSERT INTO products (name , description , created_by , located_in , image_url , qty) VALUES (%s , %s , %s , %s , %s , %s)"
    cursor.execute(sql , (name,description,created_by ,located_in,image_url,qty))
    mysql.connection.commit()
    return  jsonify({"messsage" : "Product added !"})

@prodcuts.route("/updateProduct/<product_id>", methods=["PUT"])
def updateProductById(product_id):
    data = request.json
    name = data.get("name")
    description = data.get("description")
    located_in = data.get("located_in")
    image_url = data.get("image_url")
    qty =  data.get("qty")

    cursor = mysql.connection.cursor()

    sql = """
        UPDATE products
        SET name = %s,
            description = %s,
            located_in = %s,
            image_url = %s,
            qty=%s
        WHERE product_id = %s
    """

    cursor.execute(sql, (name, description, located_in, image_url, qty ,product_id))
    mysql.connection.commit()

    return jsonify({"message": "Product updated!"})
@prodcuts.route("/deleteProduct/<product_id>", methods=["DELETE"])
def deleteProductById(product_id):


    cursor = mysql.connection.cursor()

    sql = """
        DELETE FROM 
        products 
        where product_id = %s
    """

    cursor.execute(sql , (product_id,))
    mysql.connection.commit()

    return jsonify({"message": "Product Deleted!"})















