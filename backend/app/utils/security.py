import jwt
from datetime import datetime, timedelta, timezone
from typing import Optional
from passlib.context import CryptContext
from app.config import settings

# Explicit work factor rounds set to 12 for strong cryptographic hashing resistance
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto", bcrypt__rounds=12)

def hash_password(plain: str) -> str:
    """Hashes a plain password using bcrypt (rounds=12)."""
    return pwd_context.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    """Verifies a plain password against the stored bcrypt hash."""
    return pwd_context.verify(plain, hashed)

def create_access_token(data: dict) -> str:
    """Generates an access JWT token expiring in 15 minutes."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": int(expire.timestamp()), "type": "access"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def create_refresh_token(data: dict) -> str:
    """Generates a refresh JWT token expiring in 7 days."""
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(days=7)
    to_encode.update({"exp": int(expire.timestamp()), "type": "refresh"})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

def decode_token(token: str) -> Optional[dict]:
    """Decodes a JWT token. Catches all exceptions and returns None on error."""
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
    except jwt.PyJWTError:
        return None
