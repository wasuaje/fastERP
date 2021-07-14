from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy import Date, DateTime
from sqlalchemy import Boolean, Float
from sqlalchemy.sql import select, func
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.orm import relationship, column_property
import datetime
import os
import sys


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)
from app.database import Base


class Client(Base):
    __tablename__ = "app_contact"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    name = Column(String(100))
    age = Column(Integer, default=0)
    gender = Column(String(1), nullable=True)
    email = Column(String(100), nullable=True)
    phone = Column(String(50))
    address = Column(String(250), nullable=True)
    city = Column(String(50), nullable=True)
    state = Column(String(50), nullable=True)
    zip_code = Column(String(10), nullable=True)
    dob = Column(String(10), nullable=True)
    driver_id = Column(String(20), nullable=True)
    auth_area = Column(String(20), nullable=True)
    auth_color = Column(String(20), nullable=True)
    acceptance = Column(Integer, default=0)
    created_on = Column(DateTime, default=datetime.datetime.now())

    invoice = relationship("Invoice", back_populates="client")
    event = relationship("Event", back_populates="client")


class Provider(Base):
    __tablename__ = "app_provider"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    name = Column(String(100))
    cuit = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True)
    phone = Column(String(50))
    address = Column(String(250), nullable=True)
    city = Column(String(50), nullable=True)
    state = Column(String(50), nullable=True)
    zip_code = Column(String(10), nullable=True)
    created_on = Column(DateTime, default=datetime.datetime.now())

    purchase = relationship("Purchase", back_populates="provider")


class ProductCategory(Base):
    __tablename__ = "app_product_category"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    created_on = Column(DateTime, default=datetime.datetime.now())

    product_category = relationship("Product", back_populates="category")


class Product(Base):
    __tablename__ = "app_product"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    price = Column(Float, default=0.00)
    dct = Column(Float, default=0.00)
    tax = Column(Float, default=0.00)
    stock = Column(Integer, default=0)
    bar_code = Column(String(100))
    category_id = Column(Integer, ForeignKey("app_product_category.id"))
    created_on = Column(DateTime, default=datetime.datetime.now())

    invoice_detail = relationship("InvoiceDetail", back_populates="product")
    purchase_detail = relationship("PurchaseDetail", back_populates="product")
    category = relationship(
        "ProductCategory", back_populates="product_category")


class Profesional(Base):
    __tablename__ = "app_profesional"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=True)
    gender = Column(String(1), nullable=True)
    email = Column(String(100), nullable=True)
    phone = Column(String(100), nullable=True)
    created_on = Column(DateTime, default=datetime.datetime.now())

    invoice = relationship("Invoice",
                           back_populates="profesional")

    event = relationship("Event", back_populates="profesional")


class Cash(Base):
    __tablename__ = "app_caja"

    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date, index=True)
    apertura = Column(Date)
    cierre = Column(Date)
    descripcion = Column(String(200))
    monto_apertura = Column(Float, default=0.00)
    monto_cierre = Column(Float, default=0.00)
    status = Column(Integer, default=0)
    created_on = Column(DateTime, default=datetime.datetime.now())

    cash_detail = relationship("CashDetail", back_populates="cash")


class CashDetail(Base):
    __tablename__ = "app_cajadetalle"

    id = Column(Integer, primary_key=True, index=True)
    concepto = Column(String(100))
    monto = Column(Float, default=0.00)
    caja_id = Column(Integer, ForeignKey("app_caja.id"))

    cash = relationship("Cash", back_populates="cash_detail")


class InvoiceDetail(Base):
    __tablename__ = "app_invoicedetail"

    id = Column(Integer, primary_key=True, index=True)
    qtty = Column(Integer, default=1)
    price = Column(Float, default=0.00)
    invoice_id = Column(Integer, ForeignKey("app_invoice.id"))
    product_id = Column(Integer, ForeignKey("app_product.id"))
    invoice = relationship("Invoice", back_populates="invoice_detail")
    product = relationship("Product", back_populates="invoice_detail")

    @hybrid_property
    def total(self):
        return self.qtty * self.price


class Invoice(Base):
    __tablename__ = "app_invoice"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    invoice = Column(String(20), nullable=True)
    order = Column(String(20), nullable=True)
    payment_nro = Column(String(20), nullable=True)
    payment_method = Column(String(20), nullable=True)
    created_on = Column(DateTime, default=datetime.datetime.now())
    contact_id = Column(Integer, ForeignKey("app_contact.id"))
    profesional_id = Column(Integer, ForeignKey("app_profesional.id"))
    client = relationship("Client", back_populates="invoice")
    invoice_detail = relationship("InvoiceDetail", back_populates="invoice")
    profesional = relationship("Profesional", back_populates="invoice")

    @hybrid_property
    def total(self):
        return func.sum(self.invoice_detail.total)


class Purchase(Base):
    __tablename__ = "app_purchase"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    invoice = Column(String(20), nullable=True)
    order = Column(String(20), nullable=True)
    payment_nro = Column(String(20), nullable=True)
    payment_method = Column(String(20), nullable=True)
    created_on = Column(DateTime, default=datetime.datetime.now())
    provider_id = Column(Integer, ForeignKey("app_provider.id"))

    provider = relationship("Provider", back_populates="purchase")
    purchase_detail = relationship("PurchaseDetail", back_populates="purchase")


class PurchaseDetail(Base):
    __tablename__ = "app_purchasedetail"

    id = Column(Integer, primary_key=True, index=True)
    qtty = Column(Integer, default=1)
    price = Column(Float, default=0.00)
    purchase_id = Column(Integer, ForeignKey("app_purchase.id"))
    product_id = Column(Integer, ForeignKey("app_product.id"))

    purchase = relationship("Purchase", back_populates="purchase_detail")
    product = relationship("Product", back_populates="purchase_detail")


class Speciality(Base):
    __tablename__ = "app_speciality"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150))
    created_on = Column(DateTime, default=datetime.datetime.now())

    event = relationship("Event", back_populates="speciality")


class Event(Base):
    __tablename__ = "app_appointment"

    id = Column(Integer, primary_key=True, index=True)
    start = Column(Date)
    end = Column(Date)
    contact_id = Column(Integer, ForeignKey("app_contact.id"))
    profesional_id = Column(Integer, ForeignKey("app_profesional.id"))
    speciality_id = Column(Integer, ForeignKey("app_speciality.id"))
    created_on = Column(DateTime, default=datetime.datetime.now())

    client = relationship("Client", back_populates="event")
    profesional = relationship("Profesional", back_populates="event")
    speciality = relationship("Speciality", back_populates="event")


class User(Base):
    __tablename__ = "auth_user"

    id = Column(Integer, primary_key=True, index=True)
    password = Column(String(500))
    last_login = Column(Date)
    is_superuser = Column(Integer, default=0)
    username = Column(String(20))
    first_name = Column(String(50))
    last_name = Column(String(50))
    email = Column(String(100))
    is_staff = Column(Integer, default=0)
    is_active = Column(Integer, default=0)
    date_joined = Column(Date)
    permission = relationship("UserPermission", back_populates="user")


class UserPermission(Base):
    __tablename__ = "auth_user_permission"

    id = Column(Integer, primary_key=True, index=True)
    path = Column(String(200))
    can_list = Column(Integer, default=0)
    can_get = Column(Integer, default=0)        # get one
    can_post = Column(Integer, default=0)
    can_patch = Column(Integer, default=0)
    can_delete = Column(Integer, default=0)
    created_on = Column(DateTime, default=datetime.datetime.now())
    user_id = Column(Integer, ForeignKey("auth_user.id"))
    user = relationship("User", back_populates="permission")


class Configuration(Base):
    __tablename__ = "app_configuration"

    id = Column(Integer, primary_key=True, index=True)
    config_name = Column(String(50))
    config_value = Column(String(500))
    created_on = Column(DateTime, default=datetime.datetime.now())

