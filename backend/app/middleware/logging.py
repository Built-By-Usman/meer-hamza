import time
import json
import logging
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.utils.security import decode_token

logger = logging.getLogger("api_logger")
# Ensure logger has at least an INFO level if not set by config
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter("%(message)s")
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        path = request.url.path
        
        # Exclude health endpoints from logs to avoid massive log file bloat
        if path.startswith("/health"):
            return await call_next(request)
            
        start_time = time.time()
        
        # Extract user reference from header or cookie credentials
        user_id = None
        auth_header = request.headers.get("Authorization")
        token = None
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
        else:
            token = request.cookies.get("access_token")
            
        if token:
            payload = decode_token(token)
            if payload:
                user_id = payload.get("sub")
                
        response = await call_next(request)
        
        duration_ms = int((time.time() - start_time) * 1000)
        
        log_data = {
            "method": request.method,
            "path": path,
            "status_code": response.status_code,
            "duration_ms": duration_ms,
            "user_id": user_id
        }
        
        log_msg = json.dumps(log_data)
        
        # Issue warnings for requests that violate our 500ms latency target
        if duration_ms > 500:
            logger.warning(f"SLOW_REQUEST: {log_msg}")
        else:
            logger.info(log_msg)
            
        return response
