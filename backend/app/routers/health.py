from fastapi import APIRouter, status, HTTPException, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import engine, get_db

router = APIRouter()

@router.get("/health")
async def health_check(db: AsyncSession = Depends(get_db)):
    """Inspection endpoint for system administrators. Audits database and connection pool usage."""
    try:
        # Run a simple query to assert DB responsiveness
        await db.execute(text("SELECT 1"))
        
        # Retrieve QueuePool metrics from SQLAlchemy sync_engine
        pool = engine.sync_engine.pool
        pool_stats = {
            "size": pool.size() if hasattr(pool, "size") else 0,
            "checked_out": pool.checkedout() if hasattr(pool, "checkedout") else 0,
            "overflow": pool.overflow() if hasattr(pool, "overflow") else 0,
        }
        
        return {
            "status": "ok",
            "db": "connected",
            "pool": pool_stats
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={"status": "error", "db": "disconnected", "error": str(e)}
        )

@router.get("/health/ready")
async def readiness_check(db: AsyncSession = Depends(get_db)):
    """Readiness endpoint. Returns 200 if database is reachable, 503 if unavailable."""
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ready"}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Database unavailable"
        )
