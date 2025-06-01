from flask import Blueprint, request, jsonify, session, render_template, redirect, url_for, current_app, send_file
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

@login_bp.route('/admin/upload-avatar', methods=['POST'])
def upload_avatar():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    user_id = session['user_id']
    if 'avatar' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['avatar']
    from backend.utils.profile_utils import save_profile_avatar
    avatar_url, err = save_profile_avatar(file, user_id)
    if err:
        return jsonify({'error': err}), 400
    # Save path to DB
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute('UPDATE Users SET profile_image_path = %s WHERE user_id = %s', (avatar_url, user_id))
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({'success': True, 'avatar_url': avatar_url})

@login_bp.route('/login/profile', methods=['GET', 'POST'])
def profile():
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    user_id = session['user_id']
    from backend.utils.profile_utils import update_profile_info, fetch_profile_info
    conn = get_db_connection()
    if request.method == 'POST':
        username = request.form.get('username')
        cropped_avatar = request.form.get('cropped_avatar')
        avatar_url = None
        err = None
        if cropped_avatar:
            import base64, os
            from datetime import datetime
            header, encoded = cropped_avatar.split(',', 1)
            data = base64.b64decode(encoded)
            filename = f'user_{user_id}_avatar_{datetime.now().strftime("%Y%m%d%H%M%S")}.png'
            static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static'))
            avatar_rel_path = os.path.join('resources', 'profile', filename)
            avatar_path = os.path.join(static_dir, avatar_rel_path)
            os.makedirs(os.path.dirname(avatar_path), exist_ok=True)
            with open(avatar_path, 'wb') as f:
                f.write(data)
            # Save the FULL OS PATH in the database
            avatar_url = avatar_path
        avatar_url, err = update_profile_info(user_id, username, avatar_url, conn)
        conn.close()
        if err:
            return jsonify({'error': err}), 400
        session['username'] = username
        return jsonify({'success': True, 'avatar_url': avatar_url})
    else:
        profile = fetch_profile_info(user_id, conn)
        conn.close()
        if profile:
            return jsonify(profile)
        else:
            return jsonify({'error': 'Profile not found'}), 404

@login_bp.route('/profile/avatar/<int:user_id>')
def serve_profile_avatar(user_id):
    from backend.utils.profile_utils import get_profile_avatar_path
    import os
    avatar_path = get_profile_avatar_path(user_id)
    if avatar_path and os.path.exists(avatar_path):
        # Optional: add authentication/authorization check here
        return send_file(avatar_path)
    else:
        # Return default avatar if not found
        default_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/resources/profile/default-avatar.png'))
        return send_file(default_path)

