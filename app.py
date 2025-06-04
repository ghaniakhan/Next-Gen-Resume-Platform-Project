# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import os
# from werkzeug.utils import secure_filename
# from resume_parser import read_resume, parse_resume  # Ensure this is imported
# import base64
# import json
# from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
# from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
# from cryptography.hazmat.primitives import hashes
# from cryptography.hazmat.backends import default_backend
# import spacy

# # Load the spaCy English model for NLP processing
# nlp = spacy.load("en_core_web_sm")

# app = Flask(__name__)

# CORS(app, origins=["http://localhost:3000"])  # Allow CORS for development

# UPLOAD_FOLDER = 'uploads'
# os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# def calculate_score(parsed_data):
#     score = 0
#     # Increase score based on relevant sections in the resume
#     if parsed_data.get("Experience"):
#         score += 30
#     if parsed_data.get("Education"):
#         score += 25
#     if parsed_data.get("Skills"):
#         score += 20
#     if parsed_data.get("Certifications"):
#         score += 15
#     if parsed_data.get("Email"):
#         score += 10
#     return min(score, 100)

# def analyze_resume_content(resume_text):
#     doc = nlp(resume_text)
#     # Simple content analysis with named entities and keywords
#     experience_keywords = ["experience", "intern", "worked", "job", "company"]
#     education_keywords = ["Bachelors", "Masters", "PhD", "High School"]
    
#     experience = any(keyword in resume_text.lower() for keyword in experience_keywords)
#     education = any(keyword in resume_text.lower() for keyword in education_keywords)
#     skills = any(word in resume_text.lower() for word in ["python", "java", "html", "css", "javascript"])
    
#     return {
#         "Experience": experience,
#         "Education": education,
#         "Skills": skills,
#         "Certifications": "AWS" in resume_text or "Google" in resume_text,  # Example certifications
#     }

# @app.route('/upload', methods=['POST'])
# def upload_file():
#     if 'resume' not in request.files:
#         return jsonify({'error': 'No file part'}), 400

#     file = request.files['resume']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400

#     filename = secure_filename(file.filename)
#     filepath = os.path.join(UPLOAD_FOLDER, filename)
#     file.save(filepath)

#     try:
#         resume_text = read_resume(filepath)
#         parsed_data = parse_resume(resume_text)

#         # Safe access to parsed data using .get() to avoid KeyError
#         parsed_data = {key: parsed_data.get(key, None) for key in ['Experience', 'Education', 'Skills', 'Certifications', 'Email']}

#         # Perform dynamic scoring based on content analysis
#         analysis_results = analyze_resume_content(resume_text)
#         score = calculate_score(parsed_data)

#         # Provide suggestions based on content
#         suggestions = []
#         if not analysis_results["Experience"]:
#             suggestions.append("Add relevant work experience.")
#         if not analysis_results["Education"]:
#             suggestions.append("Include your educational background.")
#         if not analysis_results["Skills"]:
#             suggestions.append("Mention relevant skills.")
#         if not analysis_results["Certifications"]:
#             suggestions.append("Consider adding certifications relevant to your field.")
#         if not parsed_data["Email"]:
#             suggestions.append("Include a valid email address.")

#         text = f"Score: {score}\nSuggestions: {json.dumps(suggestions)}"

#         backend = default_backend()
#         key = os.urandom(32)  # AES-256 key
#         iv = os.urandom(12)   # GCM IV

#         encryptor = Cipher(
#             algorithms.AES(key),
#             modes.GCM(iv),
#             backend=backend
#         ).encryptor()

#         ciphertext = encryptor.update(text.encode()) + encryptor.finalize()
#         tag = encryptor.tag

#         encrypted_data = base64.b64encode(ciphertext).decode()
#         exported_key = base64.b64encode(key).decode()
#         exported_iv = base64.b64encode(iv).decode()
#         exported_tag = base64.b64encode(tag).decode()

#         return jsonify({
#             'score': score,
#             'suggestions': suggestions,
#             'encryptedText': encrypted_data,
#             'key': exported_key,
#             'iv': exported_iv,
#             'tag': exported_tag
#         })

#     except Exception as e:
#         return jsonify({'error': f'Error during resume processing: {str(e)}'}), 500


# if __name__ == '__main__':
#     app.run(debug=True)


from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from werkzeug.utils import secure_filename
from resume_parser import read_resume, parse_resume  # Ensure this is imported
import base64
import json
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.backends import default_backend
import spacy

# Load the spaCy English model for NLP processing
nlp = spacy.load("en_core_web_sm")

app = Flask(__name__)

CORS(app, origins=["http://localhost:3000"])  

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def calculate_score(parsed_data):
    score = 0
    
    if parsed_data.get("Experience"):
        score += 30
    if parsed_data.get("Education"):
        score += 25
    if parsed_data.get("Skills"):
        score += 20
    if parsed_data.get("Certifications"):
        score += 15
    if parsed_data.get("Email"):
        score += 10
    return min(score, 100)

def analyze_resume_content(resume_text):
    doc = nlp(resume_text)
    
    experience_keywords = ["experience", "intern", "worked", "job", "company"]
    education_keywords = ["Bachelors", "Masters", "PhD", "High School"]
    
    experience = any(keyword in resume_text.lower() for keyword in experience_keywords)
    education = any(keyword in resume_text.lower() for keyword in education_keywords)
    skills = any(word in resume_text.lower() for word in ["python", "java", "html", "css", "javascript"])
    
    return {
        "Experience": experience,
        "Education": education,
        "Skills": skills,
        "Certifications": "AWS" in resume_text or "Google" in resume_text,  
    }

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'resume' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['resume']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    file.save(filepath)

   
    try:
        
        score = 78  
        suggestions = [
            "Add more measurable achievements in experience.",
            "Include more technical skills like React or SQL.",
            "Consider adding certifications relevant to your domain.",
        ]

       
        encrypted_text = "U2FtcGxlRW5jcnlwdGVkVGV4dA=="
        key = "U2FtcGxlS2V5MTIzNA=="
        iv = "U2FtcGxlSW5pdFZlYw=="

        return jsonify({
            "score": score,
            "suggestions": suggestions,
            "encryptedText": encrypted_text,
            "key": key,
            "iv": iv
        }), 200

    except Exception as e:
        print("Mock error:", str(e))
        return jsonify({'error': 'Error processing mock resume.'}), 500


if __name__ == '__main__':
    app.run(debug=True)
