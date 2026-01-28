from pii_service import pii_service
import json

def test_redaction():
    sample_text = "Hello, my name is Shubham Mathur. My email is shubham@example.com and my phone number is 9876543210."
    print(f"Original Text: {sample_text}")
    
    scan_results = pii_service.scan_text(sample_text)
    print("\nScan Results:")
    for res in scan_results:
        print(f" - Entity: {res.entity_type}, Score: {res.score:.2f}, Range: [{res.start}, {res.end}], Value: {sample_text[res.start:res.end]}")

    redacted_text, mapping = pii_service.redact_text(sample_text)
    
    print("\nRedacted Text:")
    print(redacted_text)
    
    print("\nToken Mapping:")
    print(json.dumps(mapping, indent=2))
    
    # Verification checks
    assert "Shubham" not in redacted_text
    assert "Mathur" not in redacted_text
    assert "shubham@example.com" not in redacted_text
    assert "9876543210" not in redacted_text
    assert "<PERSON_1>" in redacted_text
    assert "<EMAIL_ADDRESS_1>" in redacted_text
    assert "<PHONE_NUMBER_1>" in redacted_text
    
    print("\nTest passed! Detection and Redaction are working correctly.")

if __name__ == "__main__":
    test_redaction()
