import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from google.cloud import vision

app = Flask(__name__)
CORS(app)


def perform_web_detection(image_content):
    """
    Detects web annotations given the image bytes using Google Cloud Vision.
    """
    client = vision.ImageAnnotatorClient()
    image = vision.Image(content=image_content)
    response = client.web_detection(image=image)
    annotations = response.web_detection

    results = {
        "best_guess_labels": [],
        "exact_matches": [],
        "partial_matches": [],
        "visually_similar": [],
        "pages_with_matching_images": []
    }

    if annotations.best_guess_labels:
        for label in annotations.best_guess_labels:
            results["best_guess_labels"].append(label.label)

    if annotations.full_matching_images:
        for img in annotations.full_matching_images:
            results["exact_matches"].append(img.url)

    if annotations.partial_matching_images:
        for img in annotations.partial_matching_images:
            results["partial_matches"].append(img.url)

    if annotations.visually_similar_images:
        for img in annotations.visually_similar_images:
            results["visually_similar"].append(img.url)

    if annotations.pages_with_matching_images:
        for page in annotations.pages_with_matching_images:
            results["pages_with_matching_images"].append(page.url)

    if response.error.message:
        raise Exception(
            f"{response.error.message}\nFor more info on error messages, check: "
            "https://cloud.google.com/apis/design/errors"
        )

    return results

@app.route('/analyze_image', methods=['POST'])
def analyze_image():
    if 'file' not in request.files:
        return jsonify({"error": "No file provided"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No file selected"}), 400
        
    try:
        image_content = file.read()
        web_detection_results = perform_web_detection(image_content)
        return jsonify({"web_detection": web_detection_results})
    except Exception as e:
        print(f"Vision API Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Run on port 5003
    app.run(host='0.0.0.0', port=5003, debug=True)
