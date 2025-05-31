from flask import Blueprint, request, jsonify, session, render_template
import bcrypt
from database.db import get_db_connection
from flask import redirect, url_for

login_bp = Blueprint('login', __name__, url_prefix='/api')

@login_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username_or_email = data.get('username_or_email', '')
    password = data.get('password', '')

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM Users WHERE username = %s OR email = %s", 
                       (username_or_email, username_or_email))
        user = cursor.fetchone()

        if user and bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
            # Set session data
            session['user_id'] = user['user_id']
            session['role'] = user['role']
            session['username'] = user['username']  # Optional: for frontend display

            return jsonify({
                'success': True,
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

@login_bp.route('/session', methods=['GET'])
def get_session():
    print("SESSION DEBUG:", dict(session))  # <-- Add this
    if 'user_id' in session:
        return jsonify({
            'logged_in': True,
            'user_id': session['user_id'],
            'role': session['role'],
            'username': session.get('username')
        })
    else:
        return jsonify({'logged_in': False})
    
@login_bp.route('/logout', methods=['POST'])
def logout():
    session.clear()
    return jsonify({'success': 'Logged out successfully.'})

