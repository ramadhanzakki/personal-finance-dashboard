from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import create_db_and_tables
# Import models to ensure they're registered with SQLModel
from models import User, Transaction  # noqa: F401
# Import routers
from routers.auth_router import router as auth_router
from routers.users_router import router as users_router
from routers.transactions_router import router as transactions_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for FastAPI app.
    Handles startup and shutdown events.
    """
    # Startup: Create database tables
    create_db_and_tables()
    print("✅ Database tables created successfully")
    yield
    # Shutdown: Cleanup (if needed)
    print("👋 Shutting down...")


# Initialize FastAPI app
app = FastAPI(
    title="Finance Management API",
    description="Backend API for personal finance management application",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Vite/React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(transactions_router)


@app.get("/")
async def root():
    """Health check endpoint."""
    return {"message": "Finance Management API is running", "status": "healthy"}


@app.get("/health")
async def health_check():
    """Detailed health check endpoint."""
    return {
        "status": "healthy",
        "database": "connected",
        "version": "1.0.0"
    }
