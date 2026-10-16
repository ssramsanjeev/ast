
import os
import base64

import cv2
import numpy as np
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)

# Allow requests from your deployed frontend.
# For production, set FRONTEND_URL in Render to your Vercel URL.
frontend_url = os.environ.get("FRONTEND_URL")

if frontend_url:
    CORS(app, resources={
        r"/*": {"origins": [frontend_url]}
    })
else:
    CORS(app)


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "online",
        "service": "ASTERION Image Processing API",
        "endpoints": {
            "health": "/health",
            "process_image": "POST /process-image"
        }
    })


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "healthy"})


def top(i, f, threshold):
    i &= 0xFF
    f &= 0xFF

    i2 = ((~i) + 1) & 0xFF
    f2 = ((~f) + 1) & 0xFF

    i21 = i2 & 0x7F
    f21 = f2 & 0x7F

    mult = (i21 * f21) & 0x3FFF

    l = (f - i2) & 0xFF
    final = ((l << 8) + mult) & 0xFFFF

    return 0 if final < threshold else 255


@app.route("/process-image", methods=["POST"])
def process_image():
    if "image" not in request.files:
        return jsonify({
            "error": "No image uploaded. Send the file using the 'image' field."
        }), 400

    file = request.files["image"]

    if not file.filename:
        return jsonify({"error": "No file selected"}), 400

    file_bytes = np.frombuffer(file.read(), np.uint8)
    image = cv2.imdecode(file_bytes, cv2.IMREAD_GRAYSCALE)

    if image is None:
        return jsonify({"error": "Could not decode image"}), 400

    try:
        thresh1 = float(request.form.get("thresh1", 35))
        thresh2 = float(request.form.get("thresh2", 70))

        frame1 = int(request.form.get("frame1", 31))
        frame2 = int(request.form.get("frame2", 58))
        frame3 = int(request.form.get("frame3", 87))

        output_threshold = int(
            request.form.get("output_threshold", 2047)
        )

    except (ValueError, TypeError):
        return jsonify({
            "error": "Invalid parameter types provided"
        }), 400

    if not np.isfinite(thresh1) or not np.isfinite(thresh2):
        return jsonify({
            "error": "Thresholds must be finite numbers"
        }), 400

    if thresh1 >= thresh2:
        return jsonify({
            "error": "thresh1 must be less than thresh2"
        }), 400

    if not 0 <= output_threshold <= 65535:
        return jsonify({
            "error": "output_threshold must be between 0 and 65535"
        }), 400

    if not all(0 <= f <= 255 for f in (frame1, frame2, frame3)):
        return jsonify({
            "error": "Frame values must be between 0 and 255"
        }), 400

    # Resize and calculate image intensity standard deviation.
    image = cv2.resize(image, (256, 256))
    sigma = float(np.std(image.astype(np.float64)))

    # Select the adaptive frame.
    if sigma < thresh1:
        Frame = frame1
    elif sigma < thresh2:
        Frame = frame2
    else:
        Frame = frame3

    # Run ASTERION processing.
    output8 = np.zeros((256, 256), dtype=np.uint8)

    for row in range(256):
        for col in range(256):
            output8[row, col] = top(
                int(image[row, col]),
                Frame,
                output_threshold
            )

    # Encode output image as PNG and Base64.
    success, buffer = cv2.imencode(".png", output8)

    if not success:
        return jsonify({
            "error": "Could not encode processed image"
        }), 500

    processed_base64 = base64.b64encode(
        buffer.tobytes()
    ).decode("utf-8")

    return jsonify({
        "sigma": sigma,
        "frame": Frame,
        "output_threshold": output_threshold,
        "processed_image": processed_base64,
        "used_parameters": {
            "thresh1": thresh1,
            "thresh2": thresh2,
            "frame1": frame1,
            "frame2": frame2,
            "frame3": frame3,
            "output_threshold": output_threshold
        }
    })


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 5000)),
        debug=False
    )

