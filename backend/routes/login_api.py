from flask import Blueprint, request, jsonify, session, render_template, redirect, url_for, current_app
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
        cursor.execute(
            "SELECT * FROM Users WHERE username = %s OR email = %s",
            (username_or_email, username_or_email)
        )
        user = cursor.fetchone()

        if user and bcrypt.checkpw(
            password.encode('utf-8'),
            user['password_hash'].encode('utf-8')
        ):
            # Set session data
            session['user_id'] = user['user_id']
            session['role'] = user['role']
            session['username'] = user['username'] 

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
    print("SESSION DEBUG:", dict(session))
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

@login_bp.route('/login/google')
def login_google():
    google = current_app.google
    redirect_uri = url_for('login.auth_google_callback', _external=True)
    return google.authorize_redirect(redirect_uri)

@login_bp.route('/auth/google/callback')
def auth_google_callback():
    google = current_app.google
    token = google.authorize_access_token()
    resp = google.get('userinfo')
    user_info = resp.json()
    email = user_info['email']
    name = user_info.get('name', '')
    sub = user_info.get('sub')

    # Check if user exists, else create
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM Users WHERE email = %s", (email,))
    user = cursor.fetchone()
    if not user:
        # Create new user with Google info
        cursor.execute(
            "INSERT INTO Users (username, email, password_hash, role) VALUES (%s, %s, %s, 'resident')",
            (sub, email, '')
        )
        user_id = cursor.lastrowid
        cursor.execute(
            "INSERT INTO Resident (user_id, last_name, first_name, middle_name, unit_number, building, contact_number) VALUES (%s, %s, %s, %s, %s, %s, %s)",
            (user_id, '', name, '', '', '', '')
        )
        conn.commit()
        cursor.execute("SELECT * FROM Users WHERE user_id = %s", (user_id,))
        user = cursor.fetchone()
    # Set session
    session['user_id'] = user['user_id']
    session['role'] = user['role']
    session['username'] = user['username']
    cursor.close()
    conn.close()
    # Redirect to dashboard
    if user['role'] == 'admin':
        return redirect('/admin_dashboard')
    else:
        return redirect('/resident_dashboard')

