from flask import Blueprint, request, render_template, session, redirect

resident_bp = Blueprint('resident', __name__, url_prefix='/')

@resident_bp.route('/signup/resident', methods=['GET'])
def signup():
    return render_template('resident_signup.html')