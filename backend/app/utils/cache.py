import time
import asyncio
from typing import Dict, Any, Optional, Tuple

class TTLCache:
    def __init__(self):
        # Maps cache key to a tuple of (cached_value, expiration_epoch_seconds)
        self._cache: Dict[str, Tuple[Any, float]] = {}
        self._lock = asyncio.Lock()  # Asynchronous lock preventing concurrent modification corruption

    async def get(self, key: str) -> Optional[Any]:
        """Retrieves a cached value if it is present and has not expired yet."""
        async with self._lock:
            if key not in self._cache:
                return None
            val, expiry = self._cache[key]
            if time.time() > expiry:
                del self._cache[key]  # Clean expired key
                return None
            return val

    async def set(self, key: str, value: Any, ttl: int):
        """Sets a key to a specific value with an expiration threshold (in seconds)."""
        async with self._lock:
            self._cache[key] = (value, time.time() + ttl)

    async def invalidate(self, key: str):
        """Deletes a specific cache key."""
        async with self._lock:
            if key in self._cache:
                del self._cache[key]

    async def clear_prefix(self, prefix: str):
        """Clears all cache keys that start with a specific string prefix."""
        async with self._lock:
            keys_to_delete = [k for k in self._cache.keys() if k.startswith(prefix)]
            for k in keys_to_delete:
                del self._cache[k]

# Global application cache instance
cache_instance = TTLCache()
