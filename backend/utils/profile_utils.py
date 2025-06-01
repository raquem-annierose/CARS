# profile_utils.py
"""
Utility functions for profile management: upload, update, and view profile info.
"""

import os

def get_profile_info(user_id, db_conn):
    cursor = db_conn.cursor(dictionary=True)
    cursor.execute('SELECT username, avatar_url FROM Users WHERE user_id = %s', (user_id,))
    user = cursor.fetchone()
    cursor.close()
    if user:
        return {
            'username': user['username'],
            'avatar_url': user.get('avatar_url')
        }
    return None

def update_profile_info(user_id, username, avatar_url, db_conn):
    cursor = db_conn.cursor()
    if avatar_url:
        # Save full OS path in DB
        static_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static'))
        if avatar_url.startswith('/static/'):
            rel_path = avatar_url.lstrip('/')
            full_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../', rel_path))
        else:
            full_path = avatar_url
        cursor.execute('UPDATE Users SET username = %s, profile_image_path = %s WHERE user_id = %s', (username, full_path, user_id))
    else:
        cursor.execute('UPDATE Users SET username = %s WHERE user_id = %s', (username, user_id))
    db_conn.commit()
    cursor.close()
    # Always return the secure route for avatar_url
    if avatar_url:
        return f"/api/profile/avatar/{user_id}", None
    return None, None

def fetch_profile_info(user_id, db_conn):
    cursor = db_conn.cursor(dictionary=True)
    cursor.execute('SELECT username, profile_image_path FROM Users WHERE user_id = %s', (user_id,))
    user = cursor.fetchone()
    cursor.close()
    if user:
        # Always return the secure route for avatar_url
        avatar_url = f"/api/profile/avatar/{user_id}" if user.get('profile_image_path') else None
        return {
            'username': user['username'],
            'avatar_url': avatar_url
        }
    return None

def get_profile_avatar_path(user_id, db_conn=None):
    import os
    close_conn = False
    if db_conn is None:
        from database.db import get_db_connection
        db_conn = get_db_connection()
        close_conn = True
    cursor = db_conn.cursor(dictionary=True)
    cursor.execute('SELECT profile_image_path FROM Users WHERE user_id = %s', (user_id,))
    user = cursor.fetchone()
    cursor.close()
    if close_conn:
        db_conn.close()
    if user and user.get('profile_image_path'):
        return user['profile_image_path']
    return os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static/resources/profile/default-avatar.png'))

def save_profile_avatar(file, user_id):
    """
    Save uploaded avatar file to disk and return the full OS path.
    Returns (avatar_path, error) tuple.
    """
    import os
    from datetime import datetime
    try:
        filename = f'user_{user_id}_avatar_{datetime.now().strftime("%Y%m%d%H%M%S")}.png'
        static_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../static'))
        avatar_rel_path = os.path.join('resources', 'profile', filename)
        avatar_path = os.path.join(static_dir, avatar_rel_path)
        os.makedirs(os.path.dirname(avatar_path), exist_ok=True)
        file.save(avatar_path)
        return avatar_path, None  # Always return full OS path
    except Exception as e:
        return None, str(e)
