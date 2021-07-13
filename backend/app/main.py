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
from .routers import client, auth, cash, product, event, speciality
from .routers import profesional, cash_detail, invoice, invoice_detail
from .routers import product_category, provider, purchase, purchase_detail
from .routers import permission
from .dependencies import get_current_active_user, get_user_permissions

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
app.include_router(speciality.router)
app.include_router(cash.router)
app.include_router(cash_detail.router)
app.include_router(invoice.router)
app.include_router(invoice_detail.router)
app.include_router(purchase.router)
app.include_router(purchase_detail.router)
app.include_router(event.router)
app.include_router(auth.router)
app.include_router(permission.router)
