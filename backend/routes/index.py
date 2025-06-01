from flask import Blueprint, request, render_template, session, redirect

index_bp = Blueprint('index', __name__, url_prefix='/')

@index_bp.route('/', methods=['GET'])
def index():
    return render_template('index.html')

@index_bp.route('/about', methods=['GET'])
def about():
    return render_template('about.html')

@index_bp.route('/contact', methods=['GET'])
def contact():
    return render_template('contact.html')

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

