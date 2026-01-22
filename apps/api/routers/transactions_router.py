from typing import Optional, List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select

from database import get_session
from models import Transaction, User
from schemas import TransactionCreate, TransactionRead
from auth import get_current_user

router = APIRouter(prefix="/transactions", tags=["Transactions"])


@router.post("/", response_model=TransactionRead, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    transaction_data: TransactionCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new transaction for the authenticated user.
    
    - **amount**: Transaction amount (positive number)
    - **category**: Category (e.g., Food, Transport, Salary)
    - **type**: Either 'income' or 'expense'
    - **date**: Transaction date
    - **note**: Optional description
    """
    # Create transaction linked to current user
    new_transaction = Transaction(
        user_id=current_user.id,
        amount=transaction_data.amount,
        category=transaction_data.category,
        type=transaction_data.type,
        date=transaction_data.date,
        note=transaction_data.note
    )
    
    session.add(new_transaction)
    session.commit()
    session.refresh(new_transaction)
    
    return new_transaction


@router.get("/", response_model=List[TransactionRead])
async def get_transactions(
    limit: Optional[int] = Query(default=None, ge=1, le=100, description="Limit number of transactions returned"),
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get all transactions for the authenticated user.
    
    - **limit**: Optional limit on number of transactions (1-100)
    """
    # Query transactions belonging to current user, ordered by date descending
    statement = (
        select(Transaction)
        .where(Transaction.user_id == current_user.id)
        .order_by(Transaction.date.desc())
    )
    
    if limit:
        statement = statement.limit(limit)
    
    transactions = session.exec(statement).all()
    
    return transactions


@router.get("/{transaction_id}", response_model=TransactionRead)
async def get_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Get a specific transaction by ID.
    
    Only returns the transaction if it belongs to the authenticated user.
    """
    transaction = session.get(Transaction, transaction_id)
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Verify ownership
    if transaction.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    return transaction


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a transaction by ID.
    
    Only deletes the transaction if it belongs to the authenticated user.
    """
    transaction = session.get(Transaction, transaction_id)
    
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    # Verify ownership - return 404 to avoid leaking information
    if transaction.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Transaction not found"
        )
    
    session.delete(transaction)
    session.commit()
    
    return None
