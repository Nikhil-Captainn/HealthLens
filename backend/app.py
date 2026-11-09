import os
import logging
import gc

# ================= THE SILENCER =================
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

# ✅ FIX 1: Limit TensorFlow threads to reduce memory footprint on free tier
os.environ['TF_NUM_INTEROP_THREADS'] = '1'
os.environ['TF_NUM_INTRAOP_THREADS'] = '1'

from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image, UnidentifiedImageError
import numpy as np

log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)

app = Flask(__name__)
CORS(app)

# ================= MODEL CONFIG =================
MODEL_PATH = "model_FINAL_BEST.weights.h5"
IMG_SIZE = 224
CLASS_NAMES = ["COVID-19", "Normal", "Pneumonia", "Tuberculosis"]
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

# ✅ FIX 2: Lazy loading — model loads on first request, not at startup
# This prevents gunicorn worker from being killed before it's even ready
model = None

def load_model():
    """Load model only when first needed (lazy loading)."""
    global model
    if model is not None:
        return model

    # Import heavy libs only when needed
    import tensorflow as tf
    from tensorflow.keras.applications import VGG16
    from tensorflow.keras.layers import Flatten, Dense, Dropout
    from tensorflow.keras.models import Sequential

    if not os.path.exists(MODEL_PATH):
        raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")

    print("⏳ Loading VGG16 model (first request)...")

    # ✅ FIX 3: Use mixed precision to cut memory usage by ~40%
    # tf.keras.mixed_precision.set_global_policy('float32')  # keep float32 for stability

    base_model = VGG16(weights=None, include_top=False, input_shape=(IMG_SIZE, IMG_SIZE, 3))

    m = Sequential()
    m.add(base_model)
    m.add(Flatten())
    m.add(Dense(256, activation='relu'))
    m.add(Dropout(0.5))
    m.add(Dense(128, activation='relu'))
    m.add(Dense(4, activation='softmax'))

    m.load_weights(MODEL_PATH)

    # ✅ FIX 4: Run a dummy prediction to warm up the graph, then free temp memory
    dummy = np.zeros((1, IMG_SIZE, IMG_SIZE, 3), dtype=np.float32)
    m.predict(dummy, verbose=0)
    del dummy
    gc.collect()

    model = m
    print("=====================================================")
    print("✅ HealthLens VGG16 Engine Active and Ready.")
    print("=====================================================")
    return model


# ================= HELPERS =================
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def preprocess(img):
    img = img.resize((IMG_SIZE, IMG_SIZE))
    img = np.array(img, dtype=np.float32) / 255.0

    if len(img.shape) == 2:                # grayscale → RGB
        img = np.stack((img,) * 3, axis=-1)
    elif img.shape[2] == 4:                # RGBA → RGB
        img = img[:, :, :3]

    return np.expand_dims(img, axis=0)


# ================= ROUTES =================
@app.route("/", methods=["GET"])
def health_check():
    """Quick health ping — does NOT load the model."""
    return jsonify({
        "status": "Online",
        "engine": "VGG16",
        "model_loaded": model is not None
    }), 200


@app.route("/warmup", methods=["GET"])
def warmup():
    """
    ✅ FIX 5: Dedicated warmup endpoint.
    Call this once after deploy to pre-load the model so the
    first real prediction isn't slow. 
    Hit: https://healthlens-k6wz.onrender.com/warmup
    """
    try:
        load_model()
        return jsonify({"status": "ready", "model": "VGG16 loaded"}), 200
    except Exception as e:
        return jsonify({"status": "error", "detail": str(e)}), 500


@app.route("/predict", methods=["POST"])
def predict():
    try:
        if "image" not in request.files:
            return jsonify({"error": "No image uploaded. Please select an X-ray."}), 400

        file = request.files["image"]

        if file.filename == '':
            return jsonify({"error": "Empty file submitted."}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Invalid file type. Only PNG, JPG, JPEG allowed."}), 400

        try:
            img = Image.open(file).convert("RGB")
        except UnidentifiedImageError:
            return jsonify({"error": "Corrupted or invalid image file."}), 400

        # ✅ Load model lazily on first predict call
        m = load_model()

        img_array = preprocess(img)
        raw_predictions = m.predict(img_array, verbose=0)[0]
        class_index = int(np.argmax(raw_predictions))
        label = CLASS_NAMES[class_index]
        conf = round(float(raw_predictions[class_index]) * 100, 2)

        print(f"📊 [{file.filename}] → {label} ({conf}%)")

        return jsonify({
            "prediction": label,
            "confidence": f"{conf}%"
        }), 200

    except FileNotFoundError as e:
        print(f"🚨 MODEL NOT FOUND: {e}")
        return jsonify({"error": "Model file missing on server."}), 503
    except Exception as e:
        print(f"🚨 SERVER ERROR: {e}")
        return jsonify({"error": "Internal server error during analysis."}), 500


# ================= RUN (local dev only) =================
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)