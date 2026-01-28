import requests
import json

def test_proxy_flow():
    url = "http://localhost:8000/v1/chat/completions"
    payload = {
        "model": "gpt-3.5-turbo",
        "messages": [
            {"role": "user", "content": "My name is Shubham Mathur and my email is shubham@example.com. Please remember this."}
        ]
    }
    
    print(f"Sending request to proxy: {payload['messages'][0]['content']}")
    
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        data = response.json()
        assistant_message = data['choices'][0]['message']['content']
        print(f"\nProxy Response: {assistant_message}")
        
        # In our mock logic, the assistant mentions the first token (Shubham Mathur)
        # So the final response should contain "Shubham Mathur" NOT "<PERSON_1>"
        if "Shubham Mathur" in assistant_message and "<PERSON_1>" not in assistant_message:
            print("\nSUCCESS: PII was rehydrated correctly!")
        else:
            print("\nFAILURE: Rehydration failed or mock logic changed.")
            print(f"Full response: {json.dumps(data, indent=2)}")
    else:
        print(f"\nERROR: Status code {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_proxy_flow()
