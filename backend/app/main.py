from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from sqlalchemy.exc import SQLAlchemyError
from fastapi.responses import JSONResponse
import traceback
import logging

from app.config import settings
from app.routers import auth, products, orders, cart, users, health
from app.middleware import LoggingMiddleware, RateLimitMiddleware, SecurityHeadersMiddleware


logger = logging.getLogger("api_logger")

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield

app = FastAPI(
    title="Premium E-Commerce API",
    description="High performance fully-async e-commerce backend optimized for lower-RAM VPS environments.",
    version="1.0.0",
    lifespan=lifespan,
)

# 1. Custom Exception Handlers (Production Hardening)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """Formats standard FastAPI validation errors (422) as structured JSON responses."""
    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "detail": exc.errors()
        }
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    """Maps HTTP exceptions cleanly to custom structured error fields."""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "HTTP Exception",
            "detail": exc.detail
        }
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, exc: SQLAlchemyError):
    """Intercepts database transaction errors. Logs traceback but hides SQL details from users."""
    logger.error(f"DATABASE_ERROR: {str(exc)}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Database Error",
            "detail": "A database operation failed. The incident has been logged."
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    """Global catch-all exception handler to prevent backend crashes and stack disclosures."""
    logger.error(f"GENERIC_UNHANDLED_EXCEPTION: {str(exc)}\n{traceback.format_exc()}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "detail": "An unexpected error occurred. Please contact support."
        }
    )

# 2. Middlewares Setup
app.add_middleware(LoggingMiddleware)
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RateLimitMiddleware, limit=10, window=60)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
)

# 3. Router Registrations
app.include_router(health.router, tags=["System Health"])
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(products.router, prefix="/products", tags=["Products"])
app.include_router(products.categories_router, prefix="/categories", tags=["Categories"])
app.include_router(orders.router, prefix="/orders", tags=["Orders"])
app.include_router(cart.router, prefix="/cart", tags=["Cart"])
app.include_router(users.router, prefix="/users", tags=["Users"])
