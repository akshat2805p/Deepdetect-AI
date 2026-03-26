import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import vision
from dotenv import load_dotenv

# 1. Load the environment variables from your .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

def perform_web_detection(image_content):
    """
    Detects web annotations using Google Cloud Vision.
    """
    try:
        # The client will automatically use GOOGLE_APPLICATION_CREDENTIALS from .env
        client = vision.ImageAnnotatorClient()
        image = vision.Image(content=image_content)
        response = client.web_detection(image=image)
        
        # Check for API errors immediately
        if response.error.message:
            raise Exception(response.error.message)

        annotations = response.web_detection

        # 2. Extract data safely using list comprehensions
        results = {
            "best_guess_labels": [label.label for label in annotations.best_guess_labels] if annotations.best_guess_labels else [],
            "exact_matches": [img.url for img in annotations.full_matching_images] if annotations.full_matching_images else [],
            "partial_matches": [img.url for img in annotations.partial_matching_images] if annotations.partial_matching_images else [],
            "visually_similar": [img.url for img in annotations.visually_similar_images] if annotations.visually_similar_images else [],
            "pages_with_matching_images": [page.url for page in annotations.pages_with_matching_images] if annotations.pages_with_matching_images else []
        }

        return results

    except Exception as e:
        raise Exception(f"Vision API Processing Error: {str(e)}")

@app.route('/analyze_image', methods=['POST'])
def analyze_image():
    # 3. Enhanced validation for file uploads
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
        
    try:
        image_content = file.read()
        if not image_content:
            return jsonify({"error": "File is empty"}), 400

        web_detection_results = perform_web_detection(image_content)
        return jsonify({
            "status": "success",
            "web_detection": web_detection_results
        })
        
    except Exception as e:
        print(f"Server-side Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # 4. Use the port defined in your .env (5002) or default to 5003
    port = int(os.getenv('PORT', 5003))
    app.run(host='0.0.0.0', port=port, debug=True)