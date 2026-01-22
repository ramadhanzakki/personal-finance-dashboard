from fastapi import APIRouter, Depends

from models import User
from schemas import UserResponse
from auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


@router.get("/me", response_model=UserResponse)
async def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    """
    Get the current authenticated user's profile.
    
    Requires a valid JWT token in the Authorization header.
    Returns the user's id, email, and full_name.
    """
    return current_user
