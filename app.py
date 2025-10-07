from flask import Flask
from backend.routes import register_routes
from flask_cors import CORS
import os

app = Flask(__name__)

# Enable CORS with support for credentials (cookies, headers)
# Explicitly restrict origins for credentialed requests (do not use '*' with supports_credentials=True)
CORS(app, supports_credentials=True, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:5000",
            "http://127.0.0.1:5000"
            # add other dev hosts/ports if you serve frontend separately (e.g. "http://localhost:3000")
        ]
    }
})

# Secret key for session encryption
app.secret_key = os.environ.get('SECRET_KEY', 'dev_secret_key')  # Use a secure one in production!

# Ensure session cookie settings allow browser to store/send cookie during JS fetch:
# Use 'Lax' for local development so browsers will accept the cookie without requiring Secure=True.
app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'   # changed from 'None' to 'Lax' for local dev
app.config['SESSION_COOKIE_SECURE'] = False     # set True in production with HTTPS
app.config['SESSION_COOKIE_HTTPONLY'] = True

# Register Blueprints
register_routes(app)

if __name__ == '__main__':
    app.run(debug=True)
