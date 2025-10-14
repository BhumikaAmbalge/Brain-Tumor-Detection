from flask import Flask, render_template, request
import tensorflow as tf
from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import Model
import numpy as np
import cv2
import os
import uuid
from werkzeug.utils import secure_filename

# --- Flask setup ---
app = Flask(_name_)
UPLOAD_FOLDER = 'static/uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# --- Load trained model ---
MODEL_PATH = "model/brain_tumor_model.h5"

try:
    model = tf.keras.models.load_model(MODEL_PATH)
    print("✅ Model loaded successfully.")
except Exception as e:
    raise RuntimeError(f"❌ Failed to load model at '{MODEL_PATH}': {e}")

# --- Heatmap Generator ---
def generate_heatmap(img_path):
    try:
        # Load and preprocess image
        img = image.load_img(img_path, target_size=(150, 150))
        img_array = image.img_to_array(img)
        img_array = img_array / 255.0
        x = np.expand_dims(img_array, axis=0)

        # Prediction
        prediction = model.predict(x)[0][0]
        pred_class = int(prediction > 0.5)
        print(f"Raw prediction score: {prediction:.4f}")

        # Grad-CAM setup
        last_conv = next(
            (layer for layer in reversed(model.layers) if isinstance(layer, tf.keras.layers.Conv2D)),
            None
        )

        if last_conv is None:
            raise ValueError("No Conv2D layer found in the model.")

        grad_model = Model(inputs=model.input, outputs=[last_conv.output, model.output])

        with tf.GradientTape() as tape:
            conv_outputs, predictions = grad_model(x)
            loss = predictions[:, 0]

        grads = tape.gradient(loss, conv_outputs)
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))
        conv_outputs = conv_outputs[0]

        heatmap = tf.reduce_sum(conv_outputs * pooled_grads, axis=-1)
        heatmap = np.maximum(heatmap, 0)
        heatmap /= (np.max(heatmap) + 1e-10)
        heatmap = cv2.resize(heatmap.numpy(), (150, 150))
        heatmap = np.uint8(255 * heatmap)
        heatmap_color = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)

        # Overlay heatmap on original image
        orig = cv2.imread(img_path)
        orig = cv2.resize(orig, (150, 150))
        overlay = cv2.addWeighted(orig, 0.6, heatmap_color, 0.4, 0)

        # Save heatmap image
        heatmap_filename = f"heat_{uuid.uuid4().hex}.jpg"
        heatmap_path = os.path.join(UPLOAD_FOLDER, heatmap_filename)
        cv2.imwrite(heatmap_path, overlay)

        result = "✅ Tumor Detected" if pred_class else "🧠 No Tumor Detected"
        return result, heatmap_filename

    except Exception as e:
        print(f"❌ Error generating heatmap: {e}")
        return "Error processing image.", None

# --- Routes ---
@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["POST"])
def predict():
    if 'file' not in request.files:
        return render_template("index.html", prediction="❌ No file uploaded.", img=None)

    file = request.files['file']
    if file.filename == "":
        return render_template("index.html", prediction="❌ No file selected.", img=None)

    try:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        prediction, heatmap_img = generate_heatmap(filepath)
        return render_template("index.html", prediction=prediction, img=heatmap_img)

    except Exception as e:
        print(f"❌ Error during prediction: {e}")
        return render_template("index.html", prediction="Error during prediction.", img=None)

# --- Run App ---
if _name_ == "_main_":
    app.run(debug=True)