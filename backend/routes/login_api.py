from flask import (
    Blueprint, request, jsonify, session, render_template,
    redirect, url_for, current_app, send_file
)
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

@login_bp.route('/admin/name-details', methods=['GET'])
def get_admin_name_details():
    if 'user_id' not in session or session.get('role') != 'admin':
        return jsonify({'error': 'Unauthorized or not an admin'}), 401

    user_id = session['user_id']
    conn = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute(
            "SELECT first_name, last_name FROM Admin WHERE user_id = %s",
            (user_id,)
        )
        admin_details = cursor.fetchone()
        if admin_details:
            return jsonify({
                'first_name': admin_details['first_name'],
                'last_name': admin_details['last_name']
            })
        else:
            # Fallback to username if admin details not found for some reason
            cursor.execute(
                "SELECT username FROM Users WHERE user_id = %s", (user_id,)
            )
            user_details = cursor.fetchone()
            if user_details:
                 return jsonify({
                    'first_name': user_details['username'], # Use username as first_name
                    'last_name': '' # No last name in this fallback
                })
            return jsonify({'error': 'Admin details not found'}), 404
    except Exception as e:
        current_app.logger.error(f"Error fetching admin name details: {e}")
        return jsonify({'error': 'Server error fetching admin details'}), 500
    finally:
        if conn and conn.is_connected():
            if cursor:
                cursor.close()
            conn.close()

@login_bp.route('/profile/avatar/upload', methods=['POST'])
def upload_profile_avatar():
    """Upload a new profile avatar for the logged-in user."""
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    user_id = session['user_id']
    user_role = session.get('role')
    if 'avatar' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['avatar']
    from backend.utils.profile_utils import save_profile_avatar
    avatar_url, err = save_profile_avatar(file, user_id, user_role)
    if err:
        return jsonify({'error': err}), 400
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        'UPDATE Users SET profile_image_path = %s WHERE user_id = %s',
        (avatar_url, user_id)
    )
    conn.commit()
    cursor.close()
    conn.close()
    return jsonify({
        'success': True,
        'avatar_url': avatar_url,
        'role': user_role
    })

@login_bp.route('/profile/edit', methods=['POST'])
def edit_profile():
    """Edit profile information for the logged-in user (username, avatar)."""
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    user_id = session['user_id']
    user_role = session.get('role')
    from backend.utils.profile_utils import (
        update_profile_info, save_profile_avatar
    )
    conn = get_db_connection()
    username = request.form.get('username')
    cropped_avatar = request.form.get('cropped_avatar')
    avatar_url = None
    err = None
    if cropped_avatar:
        import base64
        header, encoded = cropped_avatar.split(',', 1)
        data = base64.b64decode(encoded)
        avatar_url, err = save_profile_avatar(
            data, user_id, user_role, is_raw_bytes=True
        )
    avatar_url, err = update_profile_info(
        user_id, username, avatar_url, conn
    )
    conn.close()
    if err:
        return jsonify({'error': err}), 400
    session['username'] = username
    return jsonify({
        'success': True,
        'avatar_url': avatar_url,
        'role': user_role
    })

@login_bp.route('/profile/fetch', methods=['GET'])
def fetch_profile():
    """Fetch full profile info for the logged-in user."""
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    user_id = session['user_id']
    from backend.utils.profile_utils import fetch_profile_info
    conn = get_db_connection()
    profile = fetch_profile_info(user_id, conn)
    conn.close()
    if profile:
        return jsonify(profile)
    else:
        return jsonify({'error': 'Profile not found'}), 404

@login_bp.route('/profile/username', methods=['GET'])
def fetch_username():
    """Fetch only the username for the logged-in user."""
    if 'user_id' not in session:
        return jsonify({'error': 'Not logged in'}), 401
    user_id = session['user_id']
    conn = get_db_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute('SELECT username FROM Users WHERE user_id = %s', (user_id,))
    user = cursor.fetchone()
    cursor.close()
    conn.close()
    if user:
        return jsonify({'username': user['username']})
    else:
        return jsonify({'error': 'User not found'}), 404

@login_bp.route('/profile/avatar/<int:user_id>')
def serve_profile_avatar(user_id):
    """Serve the profile avatar image for a given user_id."""
    from backend.utils.profile_utils import get_profile_avatar_path
    import os
    avatar_path = get_profile_avatar_path(user_id)
    if avatar_path and os.path.exists(avatar_path):
        return send_file(avatar_path)
    else:
        default_path = os.path.abspath(
            os.path.join(
                os.path.dirname(__file__),
                '../../static/resources/profile/default-avatar.png'
            )
        )
        return send_file(default_path)
