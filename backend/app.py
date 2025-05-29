import sys
import os

# Make sure parent directory is in the path to find your modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from flask import Flask
from flask_cors import CORS
from routes.register_api import register_bp
from routes.login_api import login_bp  # Import login blueprint too

app = Flask(__name__)
CORS(app)

# Register both blueprints with the same prefix `/api`
app.register_blueprint(register_bp)
app.register_blueprint(login_bp)

if __name__ == '__main__':
    app.run(debug=True)
