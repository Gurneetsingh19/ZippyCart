import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))

db = client["smartcart"]

products_collection = db["products"]
user_collection = db["users_data"]
sessions_collection = db["shopping_session"]
staff_collection = db["staff_data"]
stores_collection = db["Stores"]
