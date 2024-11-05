from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import json
import os
import random

app = FastAPI()

DATA_DIR = "./app/api/data"

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

def load_json(filename):
    try:
        with open(os.path.join(DATA_DIR, filename), 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="File not found")

async def load_keyboards():
    return load_json("keyboards.js")

async def load_mouses():
    return load_json("mouses.js")

@app.get("/hothits")
async def get_hothits():
    keyboards = load_keyboards()
    mice = load_mouses()
    # Фильтруем только те товары, которые являются хитами продаж
    hothits = [item for item in keyboards + mice if item.get("hothit", False)]
    
    # Перемешиваем список
    random.shuffle(hothits)
    
    return hothits

@app.get("/companies")
async def get_companies():
    return load_json("companies.json")

@app.get("/keyboards")
async def get_keyboards():
    return load_keyboards()

@app.get("/mice")
async def get_mice():
    return load_mouses()

@app.get("/")
async def get_allData():
    alldata = load_keyboards()
    alldata += load_mouses()
    return alldata

@app.get("/product")
async def get_product_by_slug(slug: str = None, type: str = None):
    keyboards = load_keyboards()
    mice = load_mouses()
    
    # Объединяем все продукты в один список
    all_products = keyboards + mice

    # Если slug указан, ищем продукт по slug
    if slug:
        for product in all_products:
            if product.get("slug") == slug:
                return product
        raise HTTPException(status_code=404, detail="Product not found")

    # Если только type указан, фильтруем по типу
    if type:
        filtered_products = [product for product in all_products if product.get("type") == type]
        if filtered_products:
            return filtered_products
        else:
            raise HTTPException(status_code=404, detail="No products found for this type")
    
    # Если ни slug, ни type не указаны, возвращаем ошибку
    raise HTTPException(status_code=400, detail="Must provide either slug or product type")
