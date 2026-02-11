import os
import sys

# Add the project root directory to the Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

# This wrapper handles stripping the '/api' prefix which Vercel 
# passes to the function but Flask doesn't expect in its routes.
class StripApiPrefix(object):
    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        path = environ.get('PATH_INFO', '')
        if path.startswith('/api'):
            environ['PATH_INFO'] = path[4:]
        return self.app(environ, start_response)

# Wrap the Flask app's WSGI interface
app.wsgi_app = StripApiPrefix(app.wsgi_app)
