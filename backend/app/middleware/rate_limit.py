import time
import asyncio
from fastapi import Request, Response, status
from starlette.middleware.base import BaseHTTPMiddleware
from typing import Dict, List

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, limit: int = 10, window: int = 60):
        super().__init__(app)
        self.limit = limit
        self.window = window
        self.ips: Dict[str, List[float]] = {}  # Tracks IP address mapped to access timestamps
        self.lock = asyncio.Lock()  # Thread/async lock preventing concurrency race conditions

    async def dispatch(self, request: Request, call_next) -> Response:
        path = request.url.path
        
        # Enforce rate limiting strict thresholds on sensitive authentication points
        if path in ["/auth/login", "/auth/register"]:
            ip = request.client.host if request.client else "127.0.0.1"
            now = time.time()
            
            async with self.lock:
                if ip not in self.ips:
                    self.ips[ip] = []
                
                # Prune timestamps older than sliding window limit
                self.ips[ip] = [timestamp for timestamp in self.ips[ip] if now - timestamp < self.window]
                
                if len(self.ips[ip]) >= self.limit:
                    # Calculate duration user needs to wait before trying again
                    retry_after = int(self.window - (now - self.ips[ip][0]))
                    if retry_after <= 0:
                        retry_after = 1
                        
                    return Response(
                        content="Too Many Requests - Authentication rate limit exceeded.",
                        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                        headers={"Retry-After": str(retry_after)}
                    )
                
                self.ips[ip].append(now)
                
        return await call_next(request)
