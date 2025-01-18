from flask import Flask, request, jsonify, send_file
from ultralytics import YOLO
import numpy as np
from PIL import Image
import io
import cv2
from flask_cors import CORS

# Initialize the Flask application
app = Flask(__name__)

# Enable CORS for cross-origin requests
CORS(app)

# Load YOLOv8 model (adjust path to your actual model)
model = YOLO("best.pt")  # Make sure to change this path to your trained YOLOv8 model

@app.route('/')
def index():
    return 'Circuit Component Detection API'

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})
    
    file = request.files['file']
    
    if file.filename == '':
        return jsonify({'error': 'No selected file'})
    
    if file:
        # Read the image file
        img = Image.open(file.stream)
        
        # Convert the image to a numpy array for YOLO model
        img_np = np.array(img)
        
        # Perform prediction using YOLOv8 model
        results = model.predict(source=img_np, save=False)
        
        # Get the image with bounding boxes
        result_image = results[0].plot()

        # Convert result image to byte format
        _, buffer = cv2.imencode('.png', result_image)
        result_image_bytes = io.BytesIO(buffer)

        return send_file(result_image_bytes, mimetype='image/png')

if __name__ == '__main__':
    app.run(debug=True)
