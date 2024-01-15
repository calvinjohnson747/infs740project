import matplotlib
from pymongo import MongoClient

CONNECTION_STRING = "mongodb://127.0.0.1:27017/Hospitaldb"
client = MongoClient(CONNECTION_STRING)