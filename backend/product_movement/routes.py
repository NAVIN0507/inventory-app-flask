from flask import Blueprint, request, jsonify

from backend.db import mysql

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
    sql = "SELECT qty from products where product_id = %s"
    cursor.execute(sql, (product_id,))
    datas = cursor.fetchone()
    oldProductQTY = datas[0]
    if oldProductQTY < qty:
        return jsonify({"Message" :"Quentity is not enough"})
    newProductQTY = oldProductQTY - qty
    sql = """
    update products
    SET qty = %s
    where product_id = %s
    """
    cursor.execute(sql , (newProductQTY , product_id))
    mysql.connection.commit()
    sql = """
    INSERT INTO
    product_movements
    (product_id , from_location , to_location , qty , created_by)   
    VALUES
    (%s , %s , %s , %s , %s)
    """
    cursor.execute(sql , (product_id, from_location , to_location , qty , created_by))
    mysql.connection.commit()

    return  jsonify({"Message" :"Product Movement Added" })