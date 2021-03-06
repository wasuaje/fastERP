from .routers import client_document_detail
from .routers import client_document
from typing import List, Optional
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from passlib.context import CryptContext
from sqlalchemy.orm import Session, scoped_session
from . import crud, models, schemas
from .database import SessionLocal, engine
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi.middleware.cors import CORSMiddleware
from .routers import client, auth, cash, product, event
from .routers import profesional, cash_detail, invoice, invoice_detail
from .routers import product_category, provider, purchase, purchase_detail
from .routers import permission, payment_method, configuration, collect
from .routers import collect_detail, bank, document_type, client_document
from .routers import client_document_detail, inventory, inventory_detail
from .dependencies import get_current_active_user, get_user_permissions
# from fastapi_pagination import  add_pagination

models.Base.metadata.create_all(bind=engine)


app = FastAPI()

origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost/*",
    "http://localhost:8080",
    "http://localhost:3000",
    "http://localhost:3000/*",
    "http://localhost:8000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(client.router)
app.include_router(provider.router)
app.include_router(product_category.router)
app.include_router(product.router)
app.include_router(profesional.router)
# app.include_router(speciality.router)
app.include_router(cash.router)
app.include_router(cash_detail.router)
app.include_router(invoice.router)
app.include_router(invoice_detail.router)
app.include_router(client_document.router)
app.include_router(client_document_detail.router)
app.include_router(document_type.router)
app.include_router(purchase.router)
app.include_router(purchase_detail.router)
app.include_router(payment_method.router)
app.include_router(collect.router)
app.include_router(collect_detail.router)
app.include_router(bank.router)
app.include_router(configuration.router)
app.include_router(event.router)
app.include_router(inventory.router)
app.include_router(inventory_detail.router)
app.include_router(auth.router)
app.include_router(permission.router)


# add_pagination(app)
