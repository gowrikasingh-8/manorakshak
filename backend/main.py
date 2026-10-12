
from fastapi import FastAPI

app = FastAPI(title="Manorakshak API")


@app.get("/")
def home():
    return {"message": "Manorakshak backend is running!"}

from fastapi import FastAPI

app = FastAPI(title="Manorakshak API")


@app.get("/")
def home():
    return {"message": "Manorakshak backend is running!"}
