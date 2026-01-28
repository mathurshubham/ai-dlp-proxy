from database import init_db, engine, RedactionLog, AuditEvent
from sqlmodel import Session, select

def test_connection():
    try:
        print("Initializing database...")
        init_db()
        print("Tables created successfully.")
        
        with Session(engine) as session:
            # Try to insert a dummy record
            log = RedactionLog(request_id="test-id", token_map={"<T>": "V"})
            session.add(log)
            session.commit()
            print("Successfully inserted a record into redaction_logs.")
            
            # Clean up
            session.delete(log)
            session.commit()
            print("Successfully deleted the test record.")
            
        print("\nDatabase verification PASSED.")
    except Exception as e:
        print(f"\nDatabase verification FAILED: {e}")

if __name__ == "__main__":
    test_connection()
