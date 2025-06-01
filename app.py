from flask import Flask
from backend.routes import register_routes
from flask_cors import CORS
import os

app = Flask(__name__)

# Enable CORS with support for credentials (cookies, headers)
CORS(app, supports_credentials=True)

# Secret key for session encryption
app.secret_key = os.environ.get('SECRET_KEY', 'dev_secret_key')  # Use a secure one in production!

# Register Blueprints
register_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
