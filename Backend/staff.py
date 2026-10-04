from flask import Blueprint, jsonify, request
from db import sessions_collection, staff_collection
from datetime import datetime, timezone
from flask import request
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
# Blueprint banate hain (Iska naam 'staff_bp' rakha hai)
staff_bp = Blueprint("staff_bp", __name__)

# --- STAFF SIGNUP API ---
@staff_bp.route("/api/staff/signup", methods=["POST"])
def staff_signup():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    # 1. Check karein ki details aayi hain ya nahi
    if not email or not password or not name:
        return jsonify({"success": False, "message": "Name, email, and password required"}), 400

    # 2. Check karein ki kya staff pehle se exist karta hai
    existing_staff = staff_collection.find_one({"email": email})
    if existing_staff:
        return jsonify({"success": False, "message": "Staff email already exists"}), 400

    # 3. Password ko hash (secure) karein
    hashed_password = generate_password_hash(password)

    # 4. Database mein naya staff save karein
    new_staff = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "role": "staff" # Ek label laga diya taaki pata rahe
    }
    
    staff_collection.insert_one(new_staff)

    return jsonify({"success": True, "message": "Staff registered successfully!"}), 201


# --- STAFF LOGIN API ---
@staff_bp.route("/api/staff/login", methods=["POST"])
def staff_login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"success": False, "message": "Email and password required"}), 400

    # 1. Database mein staff dhoondhein
    staff = staff_collection.find_one({"email": email})
    
    if not staff:
        return jsonify({"success": False, "message": "Staff not found"}), 404

    # 2. Password check karein
    if not check_password_hash(staff["password"], password):
        return jsonify({"success": False, "message": "Invalid password"}), 401

    # 3. JWT Token banayein (Dhyan dein: Yahan hum 'staff_id' bhej rahe hain)
    token = jwt.encode(
        {"staff_id": str(staff["_id"])}, 
        os.getenv("JWT_SECRET"), 
        algorithm="HS256"
    )

    return jsonify({
        "success": True, 
        "message": "Staff login successful",
        "token": token,
        "staff": {
            "name": staff["name"],
            "email": staff["email"]
        }
    }), 200

# --- STEP 1: QR Scan hone par Bill Details laane ki API ---
@staff_bp.route("/api/staff/<session_id>/Bill", methods=["GET"])
def get_session_for_staff(session_id):
    
    # 1. Database se session dhoondhna
    # Dhyan rahe: Staff sirf ussi session ko dekh payega jiska status "CHECKOUT_PENDING" hai.
    # (Agar status "ACTIVE" hai, matlab customer abhi shopping kar hi raha hai)
    session = sessions_collection.find_one({
        "session_id": session_id.lower(),
        "status": "CHECKOUT_PENDING"
    })

    # Agar session nahi mila ya customer ne checkout nahi dabaya
    if not session:
        return jsonify({
            "success": False, 
            "message": "Session not found or customer has not clicked checkout yet."
        }), 404

    # 2. Staff ko Items aur Total dikhane ke liye bhej do
    return jsonify({
        "success": True,
        "message": "Bill details fetched successfully",
        "cart": {
            "session_id": session["session_id"],
            "items": session.get("items", []),
            "total": session.get("total", 0)
        }
    }), 200

# --- STEP 2: Payment Done aur Bill Create karne ki API ---
@staff_bp.route("/api/staff/<session_id>/payment_completed", methods=["POST"])
def complete_payment(session_id):
    
    # 1. Pehle check karo ki kya yeh session sach mein pending hai?
    session = sessions_collection.find_one({
        "session_id": session_id.lower(),
        "status": "CHECKOUT_PENDING"
    })

    if not session:
        return jsonify({
            "success": False, 
            "message": "Valid pending session not found. Payment cannot be processed."
        }), 404

    # 2. Payment ho gayi, toh status "COMPLETED" kar do 
    # Aur "paid_at" mein current time save kar do taaki bill ka record rahe
    sessions_collection.update_one(
        {"session_id": session_id.lower()},
        {"$set": {
            "status": "COMPLETED",
            "paid_at": datetime.now(timezone.utc)
        }}
    )

    # 3. Staff frontend ko success message bhej do
    return jsonify({
        "success": True,
        "message": "Payment successful and Bill generated!",
        "receipt": {
            "session_id": session["session_id"],
            "total_paid": session.get("total", 0),
            "items_count": len(session.get("items", []))
        }
    }), 200