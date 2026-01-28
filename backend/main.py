from fastapi import FastAPI

app = FastAPI(title="Sentinel AI Privacy Proxy")

@app.get("/")
async def root():
    return {"message": "Sentinel AI Proxy Active"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
