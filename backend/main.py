# File: main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import numpy as np
import pandas as pd
from statsmodels.tsa.seasonal import STL
from scipy.stats import t
from typing import List, Tuple
from starlette.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # The origins your application is allowed to access
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

class DataStream(BaseModel):
    data: List[float]

def generate_data_stream(size=1000):
    np.random.seed(42)
    time = np.linspace(0, 50 * np.pi, size)
    seasonal = 10 + np.sin(time) * 10
    trend = time * 0.05
    noise = np.random.normal(0, 1, size)
    outliers = np.random.choice([1, -1], size=size, p=[0.95, 0.05]) * np.random.normal(0, 20, size)
    return (seasonal + trend + noise + outliers).tolist()

def detect_anomalies(data):
    # Ensure there is enough data to define a period
    if len(data) < 40:  # The minimum length to allow for a reasonable period
        raise ValueError("Not enough data to compute the period for STL.")

    # Calculate the period trying to ensure it's valid
    period = max(2, int(len(data) / 20))  # Adjust the divisor based on your data's nature

    # Proceed with STL
    series = np.array(data)
    stl = STL(series, period=period, seasonal=13)
    result = stl.fit()
    trend = result.trend
    seasonal = result.seasonal
    residuals = result.resid

    # Detect anomalies, e.g., where residuals exceed some threshold
    anomalies = np.where(np.abs(residuals) > 2 * np.std(residuals))[0]

    return anomalies, trend, seasonal, residuals

@app.get("/simulate")
def simulate_data():
    return {"data": generate_data_stream()}

@app.post("/detect")
def detect(data: DataStream):
    try:
        anomalies, trend, seasonal, residuals = detect_anomalies(data.data)
        return {"anomalies": anomalies.tolist(), "trend": trend.tolist(), "seasonal": seasonal.tolist(), "residuals": residuals.tolist()}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))