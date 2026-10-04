from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash
import uuid
from db import stores_collection as db

store_app = Blueprint("store_app", __name__)


@store_app.route('/api/register_store', methods=['POST'])
def register_store():
    data = request.get_json()

    # Data from frontend form
    company_name = data.get('companyName')
    work_email = data.get('workEmail')
    phone_number = data.get('phoneNumber')
    password = data.get('password')
    store_address = data.get('storeAddress')

    # Basic Validation
    if not all([company_name, work_email, phone_number, password, store_address]):
        return jsonify({"error": "Sabhi fields bharna zaroori hai!"}), 400

    
    if db.find_one({"work_email": work_email}):
        return jsonify({"error": "Yeh email already registered hai."}), 409

    
    store_id = str(uuid.uuid4())
    hashed_password = generate_password_hash(password)
    
    
    qr_code_data = f"zippycart_store_{store_id}" 

   
    new_store = {
        "company_id": store_id,  
        "company_name": company_name,
        "work_email": work_email,
        "phone_number": phone_number,
        "password": hashed_password,
        "store_address": store_address,
        "qr_code_string": qr_code_data,
        "status": "active"
    }

    # Insert Data in MongoDB "Stores" Collection
    db.insert_one(new_store)

    return jsonify({
        "message": f"{company_name} successfully register ho gaya hai!",
        "company_id": store_id,
        "qr_code": qr_code_data
    }), 201