from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import tempfile
import requests
import time
import base64
from io import BytesIO
import json

app = Flask(__name__)
CORS(app)

# Configure upload folder
UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# RapidAPI configuration
RAPIDAPI_KEY = "05c79929e3msh5c41dacb97ad79bp105030jsn76126e1e09d7"
RAPIDAPI_HOST = "virtual-try-on2.p.rapidapi.com"
RAPIDAPI_URL = "https://virtual-try-on2.p.rapidapi.com/clothes-virtual-tryon"

@app.route('/api/try-on', methods=['POST'])
def try_on():
    person_path = None
    cloth_path = None
    file_handles = []
    
    try:
        # Check if files are present in the request
        if 'person_image' not in request.files or 'cloth_image' not in request.files:
            return jsonify({'error': 'Missing required files'}), 400

        person_image = request.files['person_image']
        cloth_image = request.files['cloth_image']
        
        # Save files temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as person_temp:
            person_image.save(person_temp.name)
            person_path = person_temp.name

        with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as cloth_temp:
            cloth_image.save(cloth_temp.name)
            cloth_path = cloth_temp.name

        # Prepare the files for upload
        person_file = open(person_path, 'rb')
        cloth_file = open(cloth_path, 'rb')
        file_handles = [person_file, cloth_file]
        
        # Prepare the payload
        files = {
            'personImage': ('model.jpg', person_file, 'image/jpeg'),
            'clothImage': ('shirt.jpg', cloth_file, 'image/jpeg')
        }

        # Prepare the headers
        headers = {
            'X-RapidAPI-Key': RAPIDAPI_KEY,
            'X-RapidAPI-Host': RAPIDAPI_HOST
        }

        # Make the API request
        response = requests.post(
            RAPIDAPI_URL,
            headers=headers,
            files=files
        )

        # Debug: Print raw response
        print(f"Status code: {response.status_code}")
        print(f"Response content: {response.text}")

        # Check if the request was successful
        if response.status_code == 200:
            try:
                # Try to parse as JSON
                result = response.json()
                print(f"Parsed JSON result: {result}")
                
                # Extract image URL from the response - handle potential different response formats
                img_url = None
                
                # Check for common response formats
                if isinstance(result, dict):
                    # Check for various possible keys
                    for key in ['url', 'image_url', 'result', 'output_url', 'link', 'image_link', 'img', 'image', 'output_image', 'output_path_img', 'ouput_path_img']:
                        if key in result and result[key]:
                            img_url = result[key]
                            break
                            
                    # Check nested structures
                    if not img_url and 'response' in result and isinstance(result['response'], dict):
                        for key in ['url', 'image_url', 'result', 'output_url', 'link', 'image_link', 'img', 'image', 'output_image', 'output_path_img', 'ouput_path_img']:
                            if key in result['response'] and result['response'][key]:
                                img_url = result['response'][key]
                                break

                # If we find a string in the response, it might be the URL directly
                elif isinstance(result, str) and (result.startswith('http') or result.startswith('@http')):
                    img_url = result

                # As a last resort, try to find a URL in the raw response
                if not img_url:
                    # Look for URLs in the text
                    for word in response.text.split():
                        if word.startswith('http') and ('.jpg' in word or '.png' in word or '.jpeg' in word):
                            img_url = word.strip('"\'.,;:)')
                            break
                        elif word.startswith('@http'):
                            img_url = word.strip('"\'.,;:)')
                            break
                
                # If we found a URL, process it
                if img_url:
                    # Remove the "@" prefix if present
                    if img_url.startswith('@'):
                        img_url = img_url[1:]
                    
                    print(f"Found image URL: {img_url}")
                    
                    # Download the image
                    img_response = requests.get(img_url)
                    
                    if img_response.status_code == 200:
                        # Convert image to base64 for easy transport
                        img_base64 = base64.b64encode(img_response.content).decode('utf-8')
                        return jsonify({
                            'result_image': img_base64,
                            'image_url': img_url
                        })
                    else:
                        return jsonify({
                            'error': f'Failed to download result image: {img_response.status_code}',
                            'image_url': img_url  # Still return the URL so client can try
                        }), 500
                else:
                    # Return the raw result if no image URL found
                    return jsonify({
                        'error': 'Could not find image URL in the response',
                        'raw_response': response.text
                    }), 500
                    
            except json.JSONDecodeError:
                # Not a JSON response, check if it's a direct URL or contains a URL
                text = response.text.strip()
                if text.startswith('http') or text.startswith('@http'):
                    img_url = text
                    if img_url.startswith('@'):
                        img_url = img_url[1:]
                        
                    # Download the image
                    img_response = requests.get(img_url)
                    
                    if img_response.status_code == 200:
                        # Convert image to base64 for easy transport
                        img_base64 = base64.b64encode(img_response.content).decode('utf-8')
                        return jsonify({
                            'result_image': img_base64,
                            'image_url': img_url
                        })
                    else:
                        return jsonify({
                            'error': f'Failed to download result image: {img_response.status_code}',
                            'image_url': img_url  # Still return the URL so client can try
                        }), 500
                else:
                    # Check if response contains URL
                    for word in text.split():
                        if word.startswith('http') and ('.jpg' in word or '.png' in word or '.jpeg' in word):
                            img_url = word.strip('"\'.,;:)')
                            break
                    
                    if img_url:
                        if img_url.startswith('@'):
                            img_url = img_url[1:]
                            
                        # Download the image
                        img_response = requests.get(img_url)
                        
                        if img_response.status_code == 200:
                            # Convert image to base64 for easy transport
                            img_base64 = base64.b64encode(img_response.content).decode('utf-8')
                            return jsonify({
                                'result_image': img_base64,
                                'image_url': img_url
                            })
                        else:
                            return jsonify({
                                'error': f'Failed to download result image: {img_response.status_code}',
                                'image_url': img_url  # Still return the URL so client can try
                            }), 500
                    else:
                        return jsonify({
                            'error': 'Response is not JSON and no image URL found',
                            'raw_response': response.text
                        }), 500
        else:
            return jsonify({
                'error': f'API request failed with status code {response.status_code}',
                'details': response.text
            }), response.status_code

    except Exception as e:
        import traceback
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500
    
    finally:
        # Close file handles
        for file_handle in file_handles:
            try:
                file_handle.close()
            except:
                pass
        
        # Clean up temporary files
        if person_path and os.path.exists(person_path):
            try:
                os.unlink(person_path)
            except:
                pass
                
        if cloth_path and os.path.exists(cloth_path):
            try:
                os.unlink(cloth_path)
            except:
                pass

if __name__ == '__main__':
    app.run(debug=True, port=5000) 