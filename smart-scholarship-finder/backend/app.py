from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import pickle
import pandas as pd
import traceback

app = Flask(__name__)
CORS(app)

# -----------------------------
# Load Trained Model and Dataset
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "..", "ml", "scholarship_model.pkl")
DATA_PATH = os.path.join(BASE_DIR, "..", "ml", "updated_scholarships.csv")

try:
    model = pickle.load(open(MODEL_PATH, "rb"))
    app.scholarships_df = pd.read_csv(DATA_PATH)
    print("✅ Scholarship Model and Data Loaded Successfully")
except Exception as e:
    print("❌ Model/Data Loading Failed:", str(e))
    model = None
    app.scholarships_df = None

# -----------------------------
# Health Check Route
# -----------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "running",
        "message": "SmartScholar Backend is Live 🚀"
    })

# -----------------------------
# Prediction Route
# -----------------------------
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if model is None or app.scholarships_df is None:
            return jsonify({"error": "Model or Data not loaded"}), 500

        data = request.get_json()

        if not data:
            return jsonify({"error": "No input data provided"}), 400

        print("📩 Incoming Data:", data)

        # Required fields from UI
        required_fields = [
            "Education Qualification",
            "Gender",
            "Community",
            "Disability",
            "Sports",
            "Annual-Percentage",
            "Income"
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Missing field: {field}"}), 400

        # Mapping UI values to Dataset features
        class_level_map = {
            "Undergraduate": "UG",
            "Postgraduate": "PG",
            "Diploma": "Diploma"
        }
        
        income_map = {
            "Upto 1.5L": 100000,
            "1.5L-3L": 200000,
            "Above 3L": 500000
        }
        
        marks_map = {
            "90-100": 95,
            "75-89": 80,
            "60-74": 65
        }

        row = {
            "class_level": class_level_map.get(data["Education Qualification"], "UG"),
            "gender": data["Gender"],
            "caste": data["Community"],
            "sports_quota": data["Sports"],
            "disability": data["Disability"],
            "income_limit": income_map.get(data["Income"], 200000),
            "marks_required": marks_map.get(data["Annual-Percentage"], 75)
        }

        input_df = pd.DataFrame([row])

        print("🧠 DataFrame Created:")
        print(input_df)

        # Predict probabilities
        probabilities = model.predict_proba(input_df)[0]
        classes = model.classes_

        scholarship_scores = sorted(
            zip(classes, probabilities),
            key=lambda x: x[1],
            reverse=True
        )

        top_3 = scholarship_scores[:3]
        print("🎯 Top 3 Predictions:", top_3)

        import urllib.parse
        
        # Hardcoded realistic application hubs for providers in our dataset
        PROVIDER_URLS = {
            "AICTE": "https://www.aicte-india.org/bureaus/student-development",
            "Google": "https://buildyourfuture.withgoogle.com/scholarships",
            "Tata Trusts": "https://www.tatatrusts.org/our-work/individual-grants-programme/education-grants",
            "Amazon": "https://www.amazonfutureengineer.in/scholarships",
            "LIC": "https://licindia.in/Bottom-Links/Golden-Jubilee-Foundation",
            "NSP": "https://scholarships.gov.in/",
            "Buddy4Study": "https://www.buddy4study.com/",
            "Aditya Birla": "https://www.birlascholarship.com/",
            "HDFC Bank": "https://www.hdfcbank.com/personal/about-us/csr/educational-initiatives",
            "Infosys Foundation": "https://www.infosys.com/infosys-foundation/initiatives/education.html"
        }

        recommendations = []
        for name, prob in top_3:
            s_data = app.scholarships_df[app.scholarships_df['scholarship_name'] == name]
            if not s_data.empty:
                s_info = s_data.iloc[0]
                provider = s_info.get('provider', '')
                
                # Fetch actual provider URL or fallback to Google query
                search_query = urllib.parse.quote_plus(f"{name} scholarship apply")
                valid_search_link = PROVIDER_URLS.get(provider, f"https://www.google.com/search?q={search_query}")
                
                explainable_reasons = []
                if row['gender'] == "Female" and s_info.get('gender') in ['Female', 'Any']:
                    explainable_reasons.append("Strong match for Female Candidates")
                if row['marks_required'] >= 80:
                    explainable_reasons.append("Merit-Based Allocation")
                if row['income_limit'] <= 200000:
                    explainable_reasons.append("Matched your Economic bracket")
                if row['caste'] in ["SC", "ST", "OBC"]:
                    explainable_reasons.append("Community Affirmative Action")
                    
                if not explainable_reasons:
                    explainable_reasons.append("Overall Profile Match")

                rec = {
                    "scholarship_name": name,
                    "eligibility_probability": round(float(prob) * 100, 2),
                    "amount": f"₹{s_info['amount_inr']}",
                    "deadline": str(s_info['deadline']),
                    "apply_link": valid_search_link,
                    "reasons": explainable_reasons
                }
            else:
                search_query = urllib.parse.quote_plus(f"{name} scholarship apply")
                rec = {
                    "scholarship_name": name,
                    "eligibility_probability": round(float(prob) * 100, 2),
                    "amount": "TBD",
                    "deadline": "TBD",
                    "apply_link": f"https://www.google.com/search?q={search_query}",
                    "reasons": ["High AI confidence factor"]
                }
            recommendations.append(rec)

        return jsonify({
            "status": "success",
            "recommendations": recommendations
        })

    except Exception as e:
        print("❌ ERROR OCCURRED:")
        traceback.print_exc()
        return jsonify({
            "status": "failed",
            "error": str(e)
        }), 500

# -----------------------------
# Admin Routes (RBAC Protected)
# -----------------------------
@app.route("/admin/stats", methods=["GET"])
def admin_stats():
    role = request.headers.get("Authorization")
    if role != "admin":
        return jsonify({"status": "failed", "error": "Unauthorized"}), 403
    
    if app.scholarships_df is not None:
        total = len(app.scholarships_df)
        providers = int(app.scholarships_df['provider'].nunique())
    else:
        total = 0
        providers = 0
        
    return jsonify({"status": "success", "total_scholarships": total, "total_providers": providers})

@app.route("/admin/retrain", methods=["POST"])
def admin_retrain():
    role = request.headers.get("Authorization")
    if role != "admin":
        return jsonify({"status": "failed", "error": "Unauthorized"}), 403
        
    import subprocess
    train_script = os.path.join(BASE_DIR, "..", "ml", "train_model.py")
    try:
        # Run training subprocess
        subprocess.run(["python", train_script], check=True)
        
        # Reload model globally
        global model 
        model = pickle.load(open(MODEL_PATH, "rb"))
        app.scholarships_df = pd.read_csv(DATA_PATH)
        
        return jsonify({"status": "success", "message": "Model retrained and reloaded into memory."})
    except Exception as e:
        return jsonify({"status": "failed", "error": str(e)}), 500

# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)
