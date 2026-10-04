from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
import uuid
from db import stores_collection as db

store_app = Blueprint("store_app", __name__)

# 'db' aapka MongoDB instance hai (e.g., client.smartcart)
@store_app.route('/api/register_store', methods=['POST'])
def register_store():
    data = request.get_json()

    # Frontend form se aane wala data
    company_name = data.get('companyName')
    work_email = data.get('workEmail')
    phone_number = data.get('phoneNumber')
    password = data.get('password')
    store_address = data.get('storeAddress')

    # Basic Validation
    if not all([company_name, work_email, phone_number, password, store_address]):
        return jsonify({"error": "Sabhi fields bharna zaroori hai!"}), 400

    # Check karna ki email pehle se exist toh nahi karti
    if db.find_one({"work_email": work_email}):
        return jsonify({"error": "Yeh email already registered hai."}), 409

    # Har store ke liye unique ID aur password security
    store_id = str(uuid.uuid4())
    hashed_password = generate_password_hash(password)
    
    # Yeh string baad mein frontend par QR Code image mein convert hogi
    qr_code_data = f"zippycart_store_{store_id}" 

    # Database mein save hone wala document
    new_store = {
        "company_id": store_id,  # Yeh ID ab products aur staff ke saath link hogi
        "company_name": company_name,
        "work_email": work_email,
        "phone_number": phone_number,
        "password": hashed_password,
        "store_address": store_address,
        "qr_code_string": qr_code_data,
        "status": "active"
    }

    # MongoDB ke 'stores' collection mein data insert karna
    db.insert_one(new_store)

    return jsonify({
        "message": f"{company_name} successfully register ho gaya hai!",
        "company_id": store_id,
        "qr_code": qr_code_data
    }), 201