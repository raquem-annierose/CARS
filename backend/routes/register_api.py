from flask import Blueprint, request, jsonify
import bcrypt
from database.db import get_db_connection
from utils.signup_validators import (
    is_valid_username, is_valid_email, is_valid_password,
    is_valid_name, is_valid_unit_number, is_valid_building
)

register_bp = Blueprint('register', __name__, url_prefix='/api')

@register_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    print("Received data:", data)  

    required_fields = ['username', 'email', 'password', 'first_name', 'last_name', 'unit_number', 'building']
    for field in required_fields:
        if not data.get(field):
            return jsonify({'error': f'{field} is required.'}), 400

    # Validation checks
    if not is_valid_username(data['username']):
        return jsonify({'error': 'Username must be exactly 8 characters.'}), 400

    if not is_valid_email(data['email']):
        return jsonify({'error': 'Invalid email format.'}), 400

    if not is_valid_password(data['password']):
        return jsonify({'error': 'Password must be at least 8 characters long, include letters and numbers.'}), 400

    if not is_valid_name(data['first_name']):
        return jsonify({'error': 'First name must contain only letters and spaces.'}), 400

    if not is_valid_name(data['last_name']):
        return jsonify({'error': 'Last name must contain only letters and spaces.'}), 400

    if not is_valid_unit_number(data['unit_number']):
        return jsonify({'error': 'Unit number is invalid.'}), 400

    if not is_valid_building(data['building']):
        return jsonify({'error': 'Building is invalid.'}), 400

    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM Users WHERE username = %s OR email = %s", (data['username'], data['email']))
        if cursor.fetchone():
            return jsonify({'error': 'Username or email already exists.'}), 409

        password_hash = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        cursor.execute(
            "INSERT INTO Users (username, email, password_hash, role) VALUES (%s, %s, %s, 'resident')",
            (data['username'], data['email'], password_hash)
        )
        user_id = cursor.lastrowid

        cursor.execute(
            """INSERT INTO Resident (user_id, last_name, first_name, middle_name, unit_number, building, contact_number)
               VALUES (%s, %s, %s, %s, %s, %s, %s)""",
            (user_id, data['last_name'], data['first_name'], data.get('middle_name'),
             data['unit_number'], data['building'], data.get('contact_number', ''))
        )

        conn.commit()
        return jsonify({'success': 'Account created successfully!'})

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({'error': 'Server error occurred. Please try again later.'}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
