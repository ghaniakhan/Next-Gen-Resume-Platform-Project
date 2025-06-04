import re
import spacy
import fitz  # PyMuPDF
import os

# Load the spaCy English model
nlp = spacy.load("en_core_web_sm")

def extract_email(text):
    email_pattern = re.compile(r'\b[\w\.-]+@[\w\.-]+\.\w+\b')
    emails = email_pattern.findall(text)
    return emails[0] if emails else None

def extract_name(doc):
    for ent in doc.ents:
        if ent.label_ == "PERSON":
            return ent.text
    return None

def extract_education(text):
    education_keywords = [
        "Bachelors", "Bachelor", "BA", "BS", "B.Sc", "BSc", "Masters", "Master",
        "MA", "MS", "M.Sc", "MSc", "PhD", "High School", "Intermediate", "Matric"
    ]
    education_info = []
    for line in text.split("\n"):
        for keyword in education_keywords:
            if keyword.lower() in line.lower():
                education_info.append(line.strip())
                break
    return education_info

def extract_experience(text):
    experience_keywords = [
        "experience", "intern", "worked", "job", "company", "employer", "position",
        "role", "responsibility", "project"
    ]
    experience_info = []
    for line in text.split("\n"):
        if any(keyword.lower() in line.lower() for keyword in experience_keywords):
            experience_info.append(line.strip())
    return experience_info

def parse_resume(text):
    doc = nlp(text)

    name = extract_name(doc)
    email = extract_email(text)
    education = extract_education(text)
    experience = extract_experience(text)

    return {
        "Name": name,
        "Email": email,
        "Education": education,
        "Experience": experience,
    }

def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        doc = fitz.open(pdf_path)
        for page in doc:
            text += page.get_text()
        doc.close()
    except Exception as e:
        print(f"Error reading PDF: {e}")
    return text

def read_resume(file_path):
    _, ext = os.path.splitext(file_path.lower())
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext == ".txt":
        with open(file_path, "r", encoding="utf-8") as file:
            return file.read()
    else:
        raise ValueError("Unsupported file format. Use .pdf or .txt")
