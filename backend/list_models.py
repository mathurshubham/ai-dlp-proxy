import google.generativeai as genai
import os

def list_models():
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        print("No API key found")
        return
    
    genai.configure(api_key=api_key)
    try:
        models = genai.list_models()
        print("Available models:")
        for m in models:
            if 'generateContent' in m.supported_generation_methods:
                print(f"- {m.name}")
    except Exception as e:
        print(f"Failed to list models: {e}")

if __name__ == "__main__":
    list_models()
