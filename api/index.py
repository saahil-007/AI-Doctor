import os
import sys

# Add the project root directory to the Python path
# This ensures that 'from app import app' works correctly
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import app

# Vercel expects a WSGI application.
# By importing 'app' (which is the Flask instance), Vercel's Python runtime
# will automatically detect and serve it.
