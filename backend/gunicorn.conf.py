import os
import multiprocessing

# Bind IP and port
bind = "0.0.0.0:8000"

# Async Uvicorn workers
worker_class = "uvicorn.workers.UvicornWorker"

# Worker process count formula: (2 * CPU_cores) + 1
# For a dual-core VPS, this is (2 * 2) + 1 = 5.
# We limit to 2 workers to keep memory overhead to a minimum on low-spec VPS.
workers = 2

# Threads per worker (always 1 for async event loop workers)
threads = 1

# Maximum concurrent connections per worker process
worker_connections = 1000

# Timeout parameters
timeout = 60
keepalive = 5

# Access log format in JSON structured logging
logconfig_dict = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "json": {
            "()": "logging.Formatter",
            "fmt": '{"timestamp": "%(asctime)s", "level": "%(levelname)s", "logger": "%(name)s", "message": "%(message)s"}',
            "datefmt": "%Y-%m-%dT%H:%M:%S%z",
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "json",
            "stream": "ext://sys.stdout",
        }
    },
    "root": {
        "handlers": ["console"],
        "level": "INFO",
    },
    "loggers": {
        "gunicorn.error": {
            "level": "INFO",
            "handlers": ["console"],
            "propagate": False,
            "qualname": "gunicorn.error",
        },
        "gunicorn.access": {
            "level": "INFO",
            "handlers": ["console"],
            "propagate": False,
            "qualname": "gunicorn.access",
        },
    }
}
