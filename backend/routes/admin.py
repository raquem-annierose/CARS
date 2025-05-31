from flask import Blueprint, request, render_template, session, redirect

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/signup/admin', methods=['GET'])
def admin_sign_up():
    return render_template('admin_signup.html')