import pickle
import pandas as pd

model = pickle.load(open("../ml/model.pkl", "rb"))
encoders = pickle.load(open("../ml/encoders.pkl", "rb"))

df = pd.read_csv("../ml/dataset1.csv")

def recommend(data):
    income = data["income"]
    caste = data["caste"]
    marks = data["marks"]
    gender = data["gender"]
    state = data["state"]

    # Encode inputs
    caste_enc = encoders["caste"].transform([caste])[0]
    gender_enc = encoders["gender"].transform([gender])[0]
    state_enc = encoders["state"].transform([state])[0]

    results = []

    for _, row in df.iterrows():
        if (
            income >= row["min_income"] and
            income <= row["max_income"] and
            marks >= row["min_marks"]
        ):
            results.append({
                "name": row["scholarship_name"],
                "amount": row["amount"],
                "reason": "Matches income and marks eligibility"
            })

    return results[:5]
