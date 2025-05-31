from flask import Blueprint, request, render_template, session, redirect

index_bp = Blueprint('index', __name__, url_prefix='/')

@index_bp.route('/', methods=['GET'])

def index():
    return render_template('landing_page.html')

@index_bp.route('/login', methods=['GET'])
def login():
    return render_template('login.html')

@index_bp.route("/admin_dashboard", methods=['GET'])
def admin_dashboard():
    if 'role' not in session or session['role'] != 'admin':
        return render_template('unauthorized.html')
    return render_template('admin_dashboard.html')

@index_bp.route("/resident_dashboard", methods=['GET'])
def resident_dashboard():
    if 'role' not in session or session['role'] != 'resident':
        return render_template('unauthorized.html')
    return render_template('resident_dashboard.html')

