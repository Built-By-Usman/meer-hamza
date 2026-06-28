from fastapi import APIRouter, Depends, HTTPException, status, Response, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas.user import UserCreate, UserLogin, UserResponse
from app.services.auth_service import AuthService
from app.utils.security import create_access_token, create_refresh_token, decode_token
from app.models.user import User

router = APIRouter()

def set_auth_cookies(response: Response, email: str):
    """Sets HTTPOnly cookies for both access and refresh tokens to prevent XSS-based token theft."""
    access_token = create_access_token({"sub": email})
    refresh_token = create_refresh_token({"sub": email})

    # httponly=True keeps scripts from accessing cookie values
    # secure=True ensures cookies are only transmitted over TLS
    # samesite="lax" offers robust protection against CSRF
    response.set_cookie(
        key="access_token",
        value=access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=900  # 15 minutes
    )
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=604800  # 7 days
    )

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate, response: Response, db: AsyncSession = Depends(get_db)):
    """Registers a new user and logs them in automatically by assigning cookies."""
    user = await AuthService.register_user(db, user_in)
    set_auth_cookies(response, user.email)
    return user

@router.post("/login", response_model=UserResponse)
async def login(credentials: UserLogin, response: Response, db: AsyncSession = Depends(get_db)):
    """Authenticates credentials and assigns access & refresh cookies to the browser."""
    user = await AuthService.authenticate_user(db, credentials.email, credentials.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    set_auth_cookies(response, user.email)
    return user

@router.post("/refresh")
async def refresh(request: Request, response: Response):
    """Validates the refresh token cookie and issues a new access token cookie."""
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh session token is missing"
        )

    payload = decode_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session has expired or token is invalid"
        )

    email = payload.get("sub")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session payload"
        )

    # Issue a new access token cookie (renews the 15-minute sliding session window)
    new_access_token = create_access_token({"sub": email})
    response.set_cookie(
        key="access_token",
        value=new_access_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=900
    )
    return {"message": "Access token successfully refreshed"}

@router.post("/logout")
async def logout(response: Response):
    """Instructs the client browser to immediately clear all authentication cookies."""
    response.set_cookie(
        key="access_token",
        value="",
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=0
    )
    response.set_cookie(
        key="refresh_token",
        value="",
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=0
    )
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(AuthService.get_current_user)):
    """Returns profile details for the currently logged-in user."""
    return current_user
