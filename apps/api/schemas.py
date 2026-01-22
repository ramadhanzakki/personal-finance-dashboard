from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


# ==================== Auth Schemas ====================
class UserRegister(BaseModel):
    """Schema for user registration request."""
    email: str
    password: str
    full_name: str


class UserLogin(BaseModel):
    """Schema for user login request."""
    email: str
    password: str


class Token(BaseModel):
    """Schema for token response."""
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    """Schema for token payload data."""
    user_id: Optional[int] = None


# ==================== User Schemas ====================
class UserResponse(BaseModel):
    """Schema for user response (excludes password)."""
    id: int
    email: str
    full_name: str

    class Config:
        from_attributes = True


# ==================== Transaction Schemas ====================
class TransactionCreate(BaseModel):
    """Schema for creating a new transaction."""
    amount: float
    category: str
    type: str  # 'income' or 'expense'
    date: datetime
    note: Optional[str] = None


class TransactionRead(BaseModel):
    """Schema for reading a transaction."""
    id: int
    user_id: int
    amount: float
    category: str
    type: str
    date: datetime
    note: Optional[str] = None

    class Config:
        from_attributes = True
