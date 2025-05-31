# CARS/backend/routes/__init__.py
from flask import Blueprint
from .login_api import login_bp
from .register_api import register_bp
from .resident import resident_bp
from .index import index_bp

def register_routes(app):
    app.register_blueprint(login_bp)
    app.register_blueprint(register_bp)
    app.register_blueprint(index_bp)
    app.register_blueprint(resident_bp)
