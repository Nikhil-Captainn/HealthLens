import os
import logging

# ================= THE SILENCER =================
# 1. Turn off TensorFlow CPU optimization info and oneDNN warnings
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' 

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from PIL import Image, UnidentifiedImageError
import numpy as np

# 2. Silence the default Flask "Development Server" warning for a cleaner terminal
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)

# ================= STEP 3: THE SHIELD (CORS SECURITY) =================
CORS(app, resources={r"/predict": {"origins": "*"}})

# ================= STEP 4: THE ENGINE OPTIMIZER =================
MODEL_PATH = "tb_model.h5"

if not os.path.exists(MODEL_PATH):
    print("🚨 FATAL ERROR: MODEL FILE NOT FOUND:", MODEL_PATH)
    exit()

try:
    # 3. Add compile=False to silence the "absl:Compiled the loaded model" warning
    model = tf.keras.models.load_model(MODEL_PATH, compile=False)
    
    # This is the only thing you will see in your terminal now!
    print("=====================================================")
    print("✅ HealthLens ResNet50 Engine Active and Ready.")
    print("📡 Server running cleanly on port 5000.")
    print("=====================================================")
except Exception as e:
    print(f"🚨 FATAL ERROR: Failed to load model. Ensure it is a valid .h5 file. Details: {e}")
    exit()

# ================= IMAGE SIZE =================
IMG_SIZE = 160   

# ================= STEP 2: THE GATEKEEPER (VALIDATION) =================
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess(img):
    img = img.resize((IMG_SIZE, IMG_SIZE))
    img = np.array(img) / 255.0
    
    if len(img.shape) == 2:
        img = np.stack((img,)*3, axis=-1)
    elif img.shape[2] == 4:
        img = img[:,:,:3]

    img = np.expand_dims(img, axis=0)
    return img

# ================= PREDICTION API =================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded. Please select an X-ray."}), 400

        file = request.files["image"]

        if file.filename == '':
            return jsonify({"error": "Empty file submitted. Please select a valid X-ray."}), 400

        if not allowed_file(file.filename):
             return jsonify({"error": "Invalid file type. Only PNG, JPG, and JPEG are allowed."}), 400

        try:
            img = Image.open(file).convert("RGB")
        except UnidentifiedImageError:
             return jsonify({"error": "Corrupted or invalid image file. Could not read image data."}), 400

        img = preprocess(img)
        pred = float(model.predict(img, verbose=0)[0][0]) # verbose=0 stops prediction progress bars
        print(f"📊 RAW OUTPUT [{file.filename}]: {pred}")

        if pred > 0.6:
            label = "Normal"
            conf = round(pred * 100, 2)
        elif pred < 0.4:
            label = "Tuberculosis"
            conf = round((1 - pred) * 100, 2)
        else:
            label = "Uncertain"
            conf = round(100 - abs(pred - 0.5) * 200, 2)

        return jsonify({
            "prediction": label,
            "confidence": f"{conf}%"
        }), 200 

    except Exception as e:
        print("🚨 SERVER ERROR:", e)
        return jsonify({"error": "An internal server error occurred during analysis."}), 500

# ================= RUN =================
if __name__ == "__main__":
    # We turn off the Flask startup banner completely for a pristine terminal
    app.run(host="0.0.0.0", port=5000, debug=False)