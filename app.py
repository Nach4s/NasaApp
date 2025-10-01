from flask import Flask, render_template, jsonify
import requests
import pandas as pd
import numpy as np

app = Flask(__name__)

api_key = "HU0migUdq9TpLnQrfocbqbDpsjxTxzRHxz0Np2dX"
url = "https://api.nasa.gov/neo/rest/v1/feed"
params = {"start_date": "2025-09-20", "end_date": "2025-09-22", "api_key": api_key}

response = requests.get(url, params=params)
data = response.json()

asteroids = []
for date in data["near_earth_objects"].keys():
    for i_asteroid in data["near_earth_objects"][date]:
        asteroids.append(i_asteroid)

clean_rows = []
for obj in asteroids:
    approach = obj["close_approach_data"][0]
    diameter = obj["estimated_diameter"]["meters"]
    clean_rows.append(
        {
            "name": obj["name"],
            "hazardous": obj["is_potentially_hazardous_asteroid"],
            "diam_min": diameter["estimated_diameter_min"],
            "diam_max": diameter["estimated_diameter_max"],
            "velocity": float(approach["relative_velocity"]["kilometers_per_hour"]),
            "approach_date": approach["close_approach_date"],
        }
    )


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/data")
def get_data():
    # отдаем данные в формате JSON
    return jsonify(clean_rows)


if __name__ == "__main__":
    app.run(debug=True)
