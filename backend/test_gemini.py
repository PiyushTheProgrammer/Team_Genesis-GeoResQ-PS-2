import os
import requests
from dotenv import load_dotenv

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")
print("Loaded API key:", api_key[:10] + "...")

# Test 1: google.genai Client
try:
    from google import genai
    client = genai.Client(api_key=api_key)
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Say hello for GeoResQ AI Backend",
    )
    print("google.genai SDK success:", response.text)
except Exception as e:
    print("google.genai SDK failed:", e)

# Test 2: Direct REST
models_to_test = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash", "gemini-2.5-pro"]
for model in models_to_test:
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    try:
        res = requests.post(url, json={"contents": [{"parts": [{"text": "Hello"}]}]})
        if res.status_code == 200:
            text = res.json()["candidates"][0]["content"]["parts"][0]["text"]
            print(f"REST Success for {model}:", text[:60])
            break
        else:
            print(f"REST Status {res.status_code} for {model}:", res.json().get("error", {}).get("message"))
    except Exception as ex:
        print(f"REST Exception for {model}:", ex)
