import os
import sys
import uvicorn

# Add workspace root directory to python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

if __name__ == "__main__":
    port = int(os.getenv("PORT", "8000"))
    print("==========================================================")
    print("Starting GeoResQ Disaster AI Backend Server")
    print("Powered by Google Gemini Vision API")
    print(f"Listening on port: {port}")
    print("==========================================================")
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=port, reload=False)

