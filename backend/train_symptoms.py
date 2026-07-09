import pandas as pd
import numpy as np
from sklearn.naive_bayes import MultinomialNB
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import joblib
import json
import os

# ================= PATHS =================
CSV_PATH = "dataset/Disease and symptoms dataset.csv"
MODEL_PATH = "symptom_model.pkl"
COLUMNS_PATH = "symptom_columns.json"

print("=====================================================")
print("🧠 HEALTHLENS SYMPTOM AI: TRAINING SEQUENCE INITIATED")
print("=====================================================")

if not os.path.exists(CSV_PATH):
    print(f"🚨 ERROR: Could not find {CSV_PATH}.")
    exit()

print("📂 Loading dataset...")
df = pd.read_csv(CSV_PATH)

target_col = "diseases"
print(f"🎯 Target Column: '{target_col}' with {df[target_col].nunique()} diseases.")

# ================= ULTRA-LIGHT MEMORY OPTIMIZATION =================
print("🧹 Compressing data footprint in RAM...")
for col in df.columns:
    if col != target_col:
        df[col] = df[col].astype(np.int8)

X = df.drop(columns=[target_col])
y = df[target_col]

# Save the exact order of the 377 symptoms
symptom_list = list(X.columns)
with open(COLUMNS_PATH, "w") as f:
    json.dump(symptom_list, f)
print(f"🧬 Saved {len(symptom_list)} unique symptom markers.")

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Free up RAM by deleting the original dataframe before training begins
del df

# ================= TRAINING (NAIVE BAYES) =================
print("⚙️ Training Multinomial Naive Bayes (Ultra-Lightweight Mode)...")
model = MultinomialNB()
model.fit(X_train, y_train)

# ================= TESTING =================
print("🔍 Testing accuracy on unseen data...")
predictions = model.predict(X_test)
acc = accuracy_score(y_test, predictions)
print(f"✅ Training Complete! Model Accuracy: {acc * 100:.2f}%")

# Compress and Save
joblib.dump(model, MODEL_PATH)
print(f"💾 Highly-compressed brain saved as: {MODEL_PATH}")
print("=====================================================")
print("🚀 PHASE 1 COMPLETE. READY FOR PHASE 2.")
print("=====================================================")