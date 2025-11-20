from flask import Blueprint, request, jsonify
from backend.db import mysql
import google.generativeai as genai
import os

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel("gemini-2.5-flash")

ai_chat = Blueprint("ai_agent", __name__)


def generate_sql_query(user_prompt: str) -> str:
    ai_prompt  = f"""
You are an SQL generator agent.

Your job:
1. Convert the user's request into a SAFE MySQL SELECT query.
2. Use ONLY SELECT queries.
3. Reject and avoid: UPDATE, DELETE, DROP, INSERT, TRUNCATE, ALTER, CREATE.
4. ALWAYS use correct column names based on the database schema.

Here is the FULL DATABASE SCHEMA:

TABLE: users
- user_id (INT, PK)
- name (VARCHAR)
- email (VARCHAR)
- password_hash (TEXT)
- created_at (TIMESTAMP)

TABLE: locations
- location_id (INT, PK)
- name (VARCHAR)
- address (TEXT)
- image_url (TEXT)
- created_by (INT, FK → users.user_id)
- created_at (TIMESTAMP)

TABLE: products
- product_id (INT, PK)
- name (VARCHAR)
- description (TEXT)
- qty (INT)
- created_by (INT, FK → users.user_id)
- located_in (INT, FK → locations.location_id)
- image_url (TEXT)
- created_at (TIMESTAMP)

TABLE: product_movements
- movement_id (INT, PK)
- product_id (INT, FK → products.product_id)
- from_location (INT, FK → locations.location_id)
- to_location (INT, FK → locations.location_id)
- qty (INT)
- created_by (INT, FK → users.user_id)
- timestamp (TIMESTAMP)

RULES:
- Only output raw SQL (no explanation).
- SQL must be syntactically correct for MySQL.
- If the user asks something impossible, return: "ERROR: Invalid request".

User request: "{user_prompt}"
"""


    response = model.generate_content(ai_prompt)
    sql = response.text.strip("```sql").strip("```").strip()
    return sql


def is_query_safe(sql: str) -> bool:
    forbidden = ["DELETE", "UPDATE", "DROP", "INSERT", "TRUNCATE", "ALTER"]
    sql_upper = sql.upper()
    return not any(word in sql_upper for word in forbidden)


def execute_query(sql: str):
    cursor = mysql.connection.cursor()

    cursor.execute(sql)
    rows = cursor.fetchall()
    column_names = [col[0] for col in cursor.description]

    cursor.close()

    return {
        "columns": column_names,
        "rows": rows
    }


def transform_data_with_ai(data, user_prompt):
    ai_prompt = f"""
    You are a data transformation AI.
    The user asked: "{user_prompt}"

    Here is the SQL result data:
    {data}

    Now convert this data into the MOST useful final format.
    Make it clean, structured, and readable.
    Return JSON only.
    """

    response = model.generate_content(ai_prompt)
    return response.text


@ai_chat.route("/", methods=["POST"])
def ai_generate_query():
    body = request.json
    user_prompt = body.get("prompt")

    if not user_prompt:
        return jsonify({"error": "Prompt is required"}), 400

    sql = generate_sql_query(user_prompt)

    if not is_query_safe(sql):
        return jsonify({"error": "SQL query is unsafe"}), 400

    try:
        db_result = execute_query(sql)
    except Exception as e:
        return jsonify({"error": str(e), "sql": sql}), 500

    final_ai_output = transform_data_with_ai(db_result, user_prompt)

    return jsonify({
        "sql_query": sql,
        "database_result": db_result,
        "final_output": final_ai_output
    })
