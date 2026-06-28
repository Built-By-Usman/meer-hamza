from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Optional
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate
from app.utils.security import verify_password, hash_password, decode_token

# Custom extractor supporting Swagger Authorization header OR Next.js httpOnly cookies
class OAuth2PasswordBearerOrCookie(OAuth2PasswordBearer):
    async def __call__(self, request: Request) -> Optional[str]:
        header_val = request.headers.get("Authorization")
        if header_val:
            return await super().__call__(request)
        return request.cookies.get("access_token")

oauth2_scheme = OAuth2PasswordBearerOrCookie(tokenUrl="auth/login", auto_error=False)

class AuthService:
    @staticmethod
    async def register_user(db: AsyncSession, user_create: UserCreate) -> User:
        # Prevent registration of existing emails
        result = await db.execute(select(User).where(User.email == user_create.email))
        existing_user = result.scalars().first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email address already exists."
            )
        
        # Save new user with secure password hash
        db_user = User(
            email=user_create.email,
            hashed_password=hash_password(user_create.password),
            full_name=user_create.full_name,
            is_active=True,
            is_admin=False
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        return db_user

    @staticmethod
    async def authenticate_user(db: AsyncSession, email: str, password: str) -> Optional[User]:
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    @staticmethod
    async def get_current_user(
        token: Optional[str] = Depends(oauth2_scheme),
        db: AsyncSession = Depends(get_db)
    ) -> User:
        unauthorized_exception = HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials or session expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
        if not token:
            raise unauthorized_exception
            
        payload = decode_token(token)
        # Enforce that only 'access' tokens are valid (blocks refresh-token-reuse exploits)
        if not payload or payload.get("type") != "access":
            raise unauthorized_exception
            
        email: str = payload.get("sub")
        if not email:
            raise unauthorized_exception
            
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalars().first()
        if not user:
            raise unauthorized_exception
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User account is deactivated"
            )
        return user

    @staticmethod
    async def get_current_admin_user(
        current_user: User = Depends(get_current_user)
    ) -> User:
        if not current_user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="The user does not have administrative privileges"
            )
        return current_user
