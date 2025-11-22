from flask import Blueprint, request, jsonify

from db import mysql

product_movement = Blueprint("product_movement", __name__)

@product_movement.route("/<user_id>")
def getProductMovementByUserId(user_id):
    cursor =  mysql.connection.cursor()
    sql = "SELECT * from product_movements where created_by = %s"
    cursor.execute(sql , (user_id,))
    datas = cursor.fetchall()
    allProductMovements = []
    for data in datas:
        allProductMovements.append({
            "movement_id":data[0],
            "product_id":data[1],
            "from_location":data[2],
            "to_location":data[3],
            "qty":data[4],
            "created_by":data[5]
        })
    return jsonify({"Product Movements" : allProductMovements})

@product_movement.route("/addProductMovement" , methods=["POST"])
def addProductMovement():
    data = request.json
    product_id = data.get("product_id")
    from_location = data.get("from_location")
    to_location = data.get("to_location")
    qty = data.get("qty")
    created_by = data.get("created_by")
    cursor = mysql.connection.cursor()
    
    sql = "SELECT qty FROM products WHERE product_id = %s AND located_in = %s"
    cursor.execute(sql, (product_id, from_location))
    datas = cursor.fetchone()
    
    if not datas:
        return jsonify({"message": "Product not found at source location"})
    
    oldProductQTY = datas[0]
    
    if oldProductQTY < qty:
        return jsonify({"message": "Quantity is not enough"})
    
    newProductQTY = oldProductQTY - qty
    sql = "UPDATE products SET qty = %s WHERE product_id = %s AND located_in = %s"
    cursor.execute(sql, (newProductQTY, product_id, from_location))
    
    sql = "SELECT qty FROM products WHERE product_id = %s AND located_in = %s"
    cursor.execute(sql, (product_id, to_location))
    destination_product = cursor.fetchone()
    
    if destination_product:
        new_dest_qty = destination_product[0] + qty
        sql = "UPDATE products SET qty = %s WHERE product_id = %s AND located_in = %s"
        cursor.execute(sql, (new_dest_qty, product_id, to_location))
    else:
       
        sql = "SELECT name, description, image_url, created_by FROM products WHERE product_id = %s"
        cursor.execute(sql, (product_id,))
        product_details = cursor.fetchone()
        
        sql = """
        INSERT INTO products (name, description, created_by, located_in, image_url, qty)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(sql, (product_details[0], product_details[1], product_details[3], 
                            to_location, product_details[2], qty))
    
    sql = """
    INSERT INTO product_movements
    (product_id, from_location, to_location, qty, created_by)   
    VALUES (%s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (product_id, from_location, to_location, qty, created_by))
    mysql.connection.commit()

    return jsonify({"message": "Product Movement Added Successfully"})