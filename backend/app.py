import os
import logging

# ================= THE SILENCER =================
# 1. Turn off TensorFlow CPU optimization info and oneDNN warnings
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2' 

from flask import Flask, request, jsonify
from flask_cors import CORS
import tensorflow as tf
from tensorflow.keras.applications import VGG16
from tensorflow.keras.layers import Flatten, Dense, Dropout
from tensorflow.keras.models import Model
from PIL import Image, UnidentifiedImageError
import numpy as np

# 2. Silence the default Flask "Development Server" warning for a cleaner terminal
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)

# ================= STEP 3: THE SHIELD (CORS SECURITY) =================
CORS(app, resources={r"/predict": {"origins": "*"}})

# ================= STEP 4: THE ENGINE OPTIMIZER =================
MODEL_PATH = "model_FINAL_BEST.weights.h5"
IMG_SIZE = 224   # Updated for VGG16

if not os.path.exists(MODEL_PATH):
    print("🚨 FATAL ERROR: MODEL FILE NOT FOUND:", MODEL_PATH)
    exit()

try:
    # 1. Build the VGG16 Skeleton
    base_model = VGG16(weights=None, include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))
    x = base_model.output
    x = Flatten()(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.5)(x) 
    output_layer = Dense(4, activation='softmax')(x)
    
    model = Model(inputs=base_model.input, outputs=output_layer)

    # 2. Pour the downloaded weights into the skeleton
    model.load_weights(MODEL_PATH)
    
    print("=====================================================")
    print("✅ HealthLens VGG16 Engine Active and Ready.")
    print("📡 Server running cleanly on port 5000.")
    print("=====================================================")
except Exception as e:
    print(f"🚨 FATAL ERROR: Failed to load weights. Details: {e}")
    exit()

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
        
        # Pass image to model and get array of 4 probabilities
        raw_predictions = model.predict(img, verbose=0)[0] 
        class_index = int(np.argmax(raw_predictions))
        
        # Map the exact classes from the author's model
        class_names = ["COVID-19", "Normal", "Pneumonia", "Tuberculosis"]
        label = class_names[class_index]
        
        # Calculate confidence percentage
        conf = round(raw_predictions[class_index] * 100, 2)

        print(f"📊 RAW OUTPUT [{file.filename}]: {raw_predictions} -> {label}")

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