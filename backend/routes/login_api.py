# CARS/backend/routes/login_api.py
from flask import Blueprint, request, jsonify
import bcrypt
from database.db import get_db_connection

login_bp = Blueprint('login', __name__, url_prefix='/api')

@login_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username_or_email = data.get('username_or_email', '')
    password = data.get('password', '')

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM Users WHERE username = %s OR email = %s", (username_or_email, username_or_email))
        user = cursor.fetchone()

        if user and bcrypt.checkpw(password.encode(), user['password_hash'].encode()):
            return jsonify({
                'success': True,
                'user_id': user['user_id'],
                'role': user['role']
            })
        else:
            return jsonify({'error': 'Invalid credentials.'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()
