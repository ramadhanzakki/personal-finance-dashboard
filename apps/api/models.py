from sqlmodel import SQLModel, Field, Relationship
from typing import Optional, List
from datetime import datetime


class User(SQLModel, table=True):
    """User model for authentication and profile data."""
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True, max_length=255)
    password_hash: str = Field(max_length=255)
    full_name: str = Field(max_length=255)
    
    # Relationship to transactions
    transactions: List["Transaction"] = Relationship(back_populates="user")


class Transaction(SQLModel, table=True):
    """Transaction model for financial records."""
    __tablename__ = "transactions"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    amount: float = Field(description="Transaction amount")
    category: str = Field(max_length=100, description="Transaction category (e.g., Food, Transport)")
    type: str = Field(max_length=20, description="Transaction type: 'income' or 'expense'")
    date: datetime = Field(default_factory=datetime.utcnow, description="Transaction date")
    note: Optional[str] = Field(default=None, max_length=500, description="Optional transaction note")
    
    # Relationship to user
    user: Optional[User] = Relationship(back_populates="transactions")
