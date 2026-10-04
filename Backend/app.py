from flask import Flask, request, jsonify
from flask_cors import CORS
from db import client, products_collection, user_collection, sessions_collection

from werkzeug.security import generate_password_hash, check_password_hash
import jwt
import os
from datetime import datetime, timezone, timedelta
from uuid import uuid4

from staff import staff_bp
from company_auth import store_app 




app = Flask(__name__)
CORS(app)

app.register_blueprint(staff_bp)
app.register_blueprint(store_app) 

try:
    client.admin.command("ping")
    print("MongoDB Connected Successfully!")
except Exception as e:
    print("MongoDB Connection Failed:", e)

#Scan............................................................................................
@app.route("/api/scan",methods=["post"]) # Scanner and search product from product database
def scan_product():
    data = request.get_json()
    barcode = data.get("barcode")
    current_store_id = data.get("company_id")

    if not barcode:
        return jsonify({
            "success": False,
            "message": "Barcode is required"
        }), 400
    
    product = products_collection.find_one(  #Read product from product collection using barcode
        {"barcode": barcode}
    )

    if not product:
        return jsonify({
            "success": False,
            "message": "Product not found"
        }), 404

    return jsonify({ #sent product details to frontend
        "success": True,
        "product": {
            "id": str(product["_id"]),
            "name": product["name"],
            "price": product["price"],
            "category": product["category"]
        }
    })
# Signup route.........................................................
@app.route("/api/auth/signup", methods=["post"])
def signup():
    data = request.get_json()

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

     # Validation
    if not name or not email or not password:
        return jsonify({
            "success": False,
            "message": "All fields are required"
        }), 400

    if len(password) < 6:
        return jsonify({
            "success": False,
            "message": "Password must be at least 6 characters"
        }), 400
    
    # Check if user already exists
    existing_user = user_collection.find_one({
        "email": email
    })

    if existing_user:
        return jsonify({
            "success": False,
            "message": "Email already registered"
        }), 409

    # Hash password
    hashed_password = generate_password_hash(password)

    # Create user
    user = {
        "name": name,
        "email": email,
        "password": hashed_password,
        "created_at": datetime.now(timezone.utc)
    }

    result = user_collection.insert_one(user)

    return jsonify({
        "success": True,
        "message": "User registered successfully",
        "user_id": str(result.inserted_id)
    }), 201
# Login route..............................................................
@app.route("/api/auth/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required"
        }), 400

    # Find user
    user = user_collection.find_one({
        "email": email
    })

    if not user:
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

    # Check password
    if not check_password_hash(user["password"], password):
        return jsonify({
            "success": False,
            "message": "Invalid email or password"
        }), 401

    # Create JWT token .....................................
    token = jwt.encode(
        {
            "user_id": str(user["_id"]),
            "exp": datetime.now(timezone.utc) + timedelta(hours=24)
        },
        os.getenv("JWT_SECRET"),
        algorithm="HS256"
    )

    return jsonify({
        "success": True,
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"]
        }
    }), 200
# Create shopping session route................................................
@app.route("/api/session", methods=["POST"])
def create_session():

    # JWT token 
    token = request.headers.get("Authorization")

    if not token:
        return jsonify({
            "success": False,
            "message": "Token required"
        }), 401

    # Get actual token from "Bearer token" 
    token = token.replace("Bearer ", "")

    try:
        # Token verify 
        decoded = jwt.decode(
            token,
            os.getenv("JWT_SECRET"),
            algorithms=["HS256"]
        )

        user_id = decoded["user_id"]

    except:
        return jsonify({
            "success": False,
            "message": "Invalid token"
        }), 401

    # New shopping session
    session_id = str(uuid4())

    session = {
        "session_id": session_id,
        "user_id": user_id,
        "status": "ACTIVE",
        "items": [],
        "total": 0,
        "created_at": datetime.now(timezone.utc)
    }

    # MongoDB save
    sessions_collection.insert_one(session)

    return jsonify({
        "success": True,
        "message": "Shopping session created",
        "session_id": session_id
    }), 201
#product add to cart route.........................................................................
@app.route("/api/<session_id>/add", methods=["POST"])
def add_to_cart(session_id):
    
    # 1. JWT Token Check (Security)
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"success": False, "message": "Token required"}), 401

    try:
        token = token.replace("Bearer ", "")
        decoded = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        user_id = decoded["user_id"]
    except:
        return jsonify({"success": False, "message": "Invalid token"}), 401

    # 2. get barcode from request body
    data = request.get_json()
    barcode = data.get("barcode")
    current_store_id = data.get("company_id")
    
    if not barcode:
        return jsonify({"success": False, "message": "Barcode is required"}), 400

    # 3. find active session in database
    session = sessions_collection.find_one({
        "session_id": session_id,
        "user_id": user_id, 
        "status": "ACTIVE"
    })

    if not session:
        return jsonify({"success": False, "message": "Active session not found"}), 404

    # 4. find product in products collection using barcode
    product = products_collection.find_one({"barcode": barcode})
    if not product:
        return jsonify({"success": False, "message": "Product not found"}), 404


    items = session.get("items", []) 
    item_found = False

    for item in items:
        
        if item["barcode"] == barcode:
            item["quantity"] += 1
            item_found = True
            break
    
    
    if not item_found:
        items.append({
            "product_id": str(product["_id"]),
            "barcode": product["barcode"],
            "name": product["name"],
            "price": product["price"],
            "quantity": 1
        })

    # 5. calculate total price in session
    new_total = session.get("total", 0) + product["price"]

    # 6. Update session in database with new items and total
    sessions_collection.update_one(
        {"session_id": session_id},
        {"$set": {
            "items": items,
            "total": new_total
        }}
    )

    
    return jsonify({
        "success": True,
        "message": "Item added to cart",
        "cart": {
            "items": items,
            "total": new_total
        }
    }), 200
# Checkout cart route and QR Data send to UI
@app.route("/api/<session_id>/checkout", methods=["POST"])
def checkout_session(session_id):
    
    # 1. JWT Token Check
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"success": False, "message": "Token required"}), 401

    try:
        token = token.replace("Bearer ", "")
        decoded = jwt.decode(token, os.getenv("JWT_SECRET"), algorithms=["HS256"])
        user_id = decoded["user_id"]
    except:
        return jsonify({"success": False, "message": "Invalid token"}), 401

    
    session = sessions_collection.find_one({
        "session_id": session_id,
        "user_id": user_id,
        "status": "ACTIVE"
    })

    if not session:
        return jsonify({"success": False, "message": "Active session not found. Maybe already checked out?"}), 404

    
    items = session.get("items", [])
    if len(items) == 0:
        return jsonify({"success": False, "message": "Cart is empty. Add items before checkout."}), 400

    # Cart Status update (ACTIVE -> CHECKOUT_PENDING)
    sessions_collection.update_one(
        {"session_id": session_id},
        {"$set": {
            "status": "CHECKOUT_PENDING"
        }}
    )

    # Send data to frontend for QR Code generation and payment
    return jsonify({
        "success": True,
        "message": "Checkout successful. Ready for payment.",
        "qr_data": session_id,  
        "total_amount": session.get("total", 0)
    }), 200

if __name__ == "__main__":
    app.run(debug=True)