import os
import sys
import uvicorn

# Add workspace root directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

if __name__ == "__main__":
    print("==========================================================")
    print("Starting GeoResQ Disaster AI Backend Server")
    print("Powered by Google Gemini 3.8 Flash Vision API")
    print("Listening on: http://localhost:8000")
    print("==========================================================")
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
