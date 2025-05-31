from flask import Flask
from backend.routes.login_api import login_bp
from backend.routes.register_api import register_bp
from backend.routes.index import index_bp
from flask_cors import CORS
from backend.routes.resident import resident_bp
import os

app = Flask(__name__)

# Enable CORS with support for credentials (cookies, headers)
CORS(app, supports_credentials=True)

# Secret key for session encryption
app.secret_key = os.environ.get('SECRET_KEY', 'dev_secret_key')  # Use a secure one in production!

# Register Blueprints
app.register_blueprint(login_bp)
app.register_blueprint(register_bp)
app.register_blueprint(index_bp)
app.register_blueprint(resident_bp)

if __name__ == '__main__':
    app.run(debug=True)
