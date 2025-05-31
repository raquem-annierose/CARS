# --- Google OAuth2 config ---
# Set these in your environment or .env file
# os.environ['GOOGLE_CLIENT_ID'] = 'your-google-client-id'
# os.environ['GOOGLE_CLIENT_SECRET'] = 'your-google-client-secret'

import os

# Ensure the environment variables are available
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')

if not GOOGLE_CLIENT_ID or not GOOGLE_CLIENT_SECRET:
    raise EnvironmentError("Missing required Google OAuth2 environment variables.")