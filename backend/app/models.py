from .database import Base
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


class Client(Base):
    __tablename__ = "app_client"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    name = Column(String(100))
    cuit = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True)
    website = Column(String(100), nullable=True)
    phone = Column(String(50))
    address = Column(String(250), nullable=True)
    city = Column(String(50), nullable=True)
    state = Column(String(50), nullable=True)
    zip_code = Column(String(10), nullable=True)
    created_on = Column(DateTime, default=datetime.datetime.now())

    invoice = relationship("Invoice", back_populates="client")
    client_document = relationship("ClientDocument", back_populates="client")
    event = relationship("Event", back_populates="client")


class Provider(Base):
    __tablename__ = "app_provider"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date, index=True)
    name = Column(String(100))
    cuit = Column(String(100), nullable=True)
    email = Column(String(100), nullable=True)
    website = Column(String(100), nullable=True)
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
    code = Column(String(10))
    format = Column(String(25))
    price = Column(Float, default=0.00)
    cost = Column(Float, default=0.00)
    dct = Column(Float, default=0.00)
    tax = Column(Float, default=0.00)
    stock = Column(Integer, default=0)
    bar_code = Column(String(100))
    category_id = Column(Integer, ForeignKey("app_product_category.id"))
    created_on = Column(DateTime, default=datetime.datetime.now())

    invoice_detail = relationship("InvoiceDetail", back_populates="product")
    purchase_detail = relationship("PurchaseDetail", back_populates="product")
    client_document_detail = relationship(
        "ClientDocumentDetail", back_populates="product")
    category = relationship(
        "ProductCategory", back_populates="product_category")


class Employee(Base):
    __tablename__ = "app_employee"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=True)
    gender = Column(String(1), nullable=True)
    dni = Column(String(20), nullable=True)
    cuil = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    phone = Column(String(100), nullable=True)
    address = Column(String(250), nullable=True)
    city = Column(String(50), nullable=True)
    state = Column(String(50), nullable=True)
    zip_code = Column(String(10), nullable=True)
    created_on = Column(DateTime, default=datetime.datetime.now())

    invoice = relationship("Invoice",
                           back_populates="employee")

    purchase = relationship("Purchase",
                            back_populates="employee")
    client_document = relationship("ClientDocument",
                                   back_populates="employee")
    event = relationship("Event", back_populates="employee")


class Bank(Base):
    __tablename__ = "app_bank"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    created_on = Column(DateTime, default=datetime.datetime.now())

    payment_detail = relationship("PaymentDetail",
                                  back_populates="bank")

    collect_detail = relationship("CollectDetail",
                                  back_populates="bank")


class Cash(Base):
    __tablename__ = "app_cash"

    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date, index=True)
    apertura = Column(DateTime)
    cierre = Column(DateTime)
    descripcion = Column(String(200))
    monto_apertura = Column(Float, default=0.00)
    monto_cierre = Column(Float, default=0.00)
    status = Column(Integer, default=0)
    created_on = Column(DateTime, default=datetime.datetime.now())

    cash_detail = relationship("CashDetail", back_populates="cash")


class CashDetail(Base):
    __tablename__ = "app_cash_detail"

    id = Column(Integer, primary_key=True, index=True)
    concepto = Column(String(100))
    monto = Column(Float, default=0.00)
    caja_id = Column(Integer, ForeignKey("app_cash.id"), nullable=False)

    cash = relationship("Cash", back_populates="cash_detail")


class PaymentMethod(Base):
    __tablename__ = "app_payment_method"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100))
    created_on = Column(DateTime, default=datetime.datetime.now())

    collect_detail = relationship(
        "CollectDetail", back_populates="payment_method")
    payment_detail = relationship(
        "PaymentDetail", back_populates="payment_method")


class Collect(Base):  # cobros a clientes
    __tablename__ = "app_collect"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    description = Column(String(500), nullable=True)
    total = Column(Float, default=0.00)
    invoice_id = Column(Integer, ForeignKey("app_invoice.id"), nullable=False)
    created_on = Column(DateTime, default=datetime.datetime.now())

    collect_detail = relationship("CollectDetail", back_populates="collect")
    invoice = relationship("Invoice", back_populates="collect")


class CollectDetail(Base):  # detalle de cobros a clientes
    __tablename__ = "app_collect_detail"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, default=0.00)
    reference = Column(String(150), nullable=True)

    bank_id = Column(Integer, ForeignKey("app_bank.id"),  nullable=True)
    collect_id = Column(Integer, ForeignKey("app_collect.id"),  nullable=False)
    payment_method_id = Column(Integer, ForeignKey(
        "app_payment_method.id"), nullable=False)

    bank = relationship("Bank", back_populates="collect_detail")
    collect = relationship("Collect", back_populates="collect_detail")
    payment_method = relationship(
        "PaymentMethod", back_populates="collect_detail")


class Payment(Base):  # pago a proveedores
    __tablename__ = "app_payment"
    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    description = Column(String(500), nullable=True)
    total = Column(Float, default=0.00)
    purchase_id = Column(Integer, ForeignKey(
        "app_purchase.id"), nullable=False)
    created_on = Column(DateTime, default=datetime.datetime.now())

    payment_detail = relationship("PaymentDetail", back_populates="payment")
    purchase = relationship("Purchase", back_populates="payment")


class PaymentDetail(Base):  # pago a proveedores
    __tablename__ = "app_payment_detail"
    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float, default=0.00)
    reference = Column(String(150), nullable=True)

    bank_id = Column(Integer, ForeignKey("app_bank.id"),  nullable=True)
    payment_id = Column(Integer, ForeignKey("app_payment.id"),  nullable=False)
    payment_method_id = Column(Integer, ForeignKey("app_payment_method.id"))

    bank = relationship("Bank", back_populates="payment_detail")
    payment = relationship("Payment", back_populates="payment_detail")
    payment_method = relationship(
        "PaymentMethod", back_populates="payment_detail")


class Invoice(Base):
    __tablename__ = "app_invoice"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    due_date = Column(Date)
    invoice = Column(String(20), nullable=True)
    order = Column(String(20), nullable=True)
    subtotal = Column(Float, default=0.00)
    dct = Column(Float, default=0.00)
    tax = Column(Float, default=0.00)
    total = Column(Float, default=0.00)
    collected = Column(Float, default=0.00)
    body_note = Column(String(500), nullable=True)
    foot_note = Column(String(500), nullable=True)
    created_on = Column(DateTime, default=datetime.datetime.now())
    status = Column(Integer, default=0)

    client_id = Column(Integer, ForeignKey("app_client.id"),  nullable=False)
    employee_id = Column(Integer, ForeignKey(
        "app_employee.id"),  nullable=False)

    client = relationship("Client", back_populates="invoice")
    invoice_detail = relationship("InvoiceDetail", back_populates="invoice")
    collect = relationship("Collect", back_populates="invoice")
    employee = relationship("Employee", back_populates="invoice")


class InvoiceDetail(Base):
    __tablename__ = "app_invoice_detail"

    id = Column(Integer, primary_key=True, index=True)
    qtty = Column(Integer, default=1)
    price = Column(Float, default=0.00)
    invoice_id = Column(Integer, ForeignKey("app_invoice.id"),  nullable=False)
    product_id = Column(Integer, ForeignKey("app_product.id"),  nullable=False)
    invoice = relationship("Invoice", back_populates="invoice_detail")
    product = relationship("Product", back_populates="invoice_detail")

    @hybrid_property
    def total(self):
        return self.qtty * self.price


class Purchase(Base):
    __tablename__ = "app_purchase"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    due_date = Column(Date)
    invoice = Column(String(20), nullable=True)
    order = Column(String(20), nullable=True)
    subtotal = Column(Float, default=0.00)
    dct = Column(Float, default=0.00)
    tax = Column(Float, default=0.00)
    total = Column(Float, default=0.00)
    payed = Column(Float, default=0.00)
    body_note = Column(String(500), nullable=True)
    foot_note = Column(String(500), nullable=True)
    created_on = Column(DateTime, default=datetime.datetime.now())

    provider_id = Column(Integer, ForeignKey(
        "app_provider.id"), nullable=False)
    employee_id = Column(Integer, ForeignKey(
        "app_employee.id"),  nullable=False)

    provider = relationship("Provider", back_populates="purchase")
    payment = relationship("Payment", back_populates="purchase")
    purchase_detail = relationship("PurchaseDetail", back_populates="purchase")
    employee = relationship("Employee", back_populates="purchase")


class PurchaseDetail(Base):
    __tablename__ = "app_purchase_detail"

    id = Column(Integer, primary_key=True, index=True)
    qtty = Column(Integer, default=1)
    price = Column(Float, default=0.00)
    purchase_id = Column(Integer, ForeignKey(
        "app_purchase.id"), nullable=False)
    product_id = Column(Integer, ForeignKey("app_product.id"),  nullable=False)

    purchase = relationship("Purchase", back_populates="purchase_detail")
    product = relationship("Product", back_populates="purchase_detail")

    @hybrid_property
    def total(self):
        return self.qtty * self.price


class Event(Base):
    __tablename__ = "app_appointment"

    id = Column(Integer, primary_key=True, index=True)
    start = Column(Date)
    end = Column(Date)
    client_id = Column(Integer, ForeignKey("app_client.id"))
    employee_id = Column(Integer, ForeignKey("app_employee.id"))
    description = Column(String(50))
    created_on = Column(DateTime, default=datetime.datetime.now())

    client = relationship("Client", back_populates="event")
    employee = relationship("Employee", back_populates="event")


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


class DocumentType(Base):
    __tablename__ = "app_document_type"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(10))
    name = Column(String(100))
    created_on = Column(DateTime, default=datetime.datetime.now())

    client_document = relationship("ClientDocument", back_populates="document_type")


class ClientDocument(Base):
    __tablename__ = "app_client_document"

    id = Column(Integer, primary_key=True, index=True)
    date = Column(Date)
    due_date = Column(Date)
    document = Column(String(20), nullable=True)
    subtotal = Column(Float, default=0.00)
    dct = Column(Float, default=0.00)
    tax = Column(Float, default=0.00)
    total = Column(Float, default=0.00)
    body_note = Column(String(500), nullable=True)
    foot_note = Column(String(500), nullable=True)
    affect_inventory = Column(Integer, default=0)
    created_on = Column(DateTime, default=datetime.datetime.now())
    status = Column(Integer, default=0)

    document_type_id = Column(Integer, ForeignKey("app_document_type.id"),  nullable=False)
    client_id = Column(Integer, ForeignKey("app_client.id"),  nullable=False)
    employee_id = Column(Integer, ForeignKey(
        "app_employee.id"),  nullable=False)

    document_type = relationship("DocumentType", back_populates="client_document")
    client = relationship("Client", back_populates="client_document")
    client_document_detail = relationship(
        "ClientDocumentDetail", back_populates="client_document")
    employee = relationship("Employee", back_populates="client_document")


class ClientDocumentDetail(Base):
    __tablename__ = "app_client_document_detail"

    id = Column(Integer, primary_key=True, index=True)
    qtty = Column(Integer, default=1)
    price = Column(Float, default=0.00)
    client_document_id = Column(Integer, ForeignKey(
        "app_client_document.id"),  nullable=False)
    product_id = Column(Integer, ForeignKey("app_product.id"),  nullable=False)

    client_document = relationship(
        "ClientDocument", back_populates="client_document_detail")
    product = relationship("Product", back_populates="client_document_detail")

    @hybrid_property
    def total(self):
        return self.qtty * self.price
