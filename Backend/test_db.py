from db import products_collection
import json
from bson import json_util

doc = products_collection.find_one({"barcode": "8901058863646"})
print("Maggi:", json.loads(json_util.dumps(doc)) if doc else "Not Found")

doc2 = products_collection.find_one({"barcode": "8901030310243"})
print("Parle-G:", json.loads(json_util.dumps(doc2)) if doc2 else "Not Found")
