# E-Commerce Production Hardening & Deployment Guide

This guide details the asynchronous execution rules, performance audits, and step-by-step deployment commands to host the API on a single low-powered VPS.

---

## Part 1: Async Performance Audit

### 1. Database Queries: WRONG (Sync/Blocking) vs RIGHT (Async/Non-Blocking)

Always use SQLAlchemy async methods and await them to avoid blocking the single-threaded event loop.

#### Example A: Fetching Single Record
*   **WRONG**:
    ```python
    # Synchronous query blocks the worker process
    user = db.query(User).filter(User.id == user_id).first()
    ```
*   **RIGHT**:
    ```python
    # Non-blocking async execution
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    ```

#### Example B: Committing Transactions
*   **WRONG**:
    ```python
    # Synchronous commit blocks all concurrent requests
    db.add(new_product)
    db.commit()
    ```
*   **RIGHT**:
    ```python
    # Asynchronous non-blocking commit
    db.add(new_product)
    await db.commit()
    ```

#### Example C: Deleting Records
*   **WRONG**:
    ```python
    # Blocking delete execution
    db.query(Product).filter(Product.id == product_id).delete()
    ```
*   **RIGHT**:
    ```python
    # Non-blocking async delete
    await db.execute(delete(Product).where(Product.id == product_id))
    await db.commit()
    ```

---

### 2. Blocking CPU-Bound Tasks (`run_in_executor`)

Heavy computational operations (like image resizing or password hashing verification in bulk) will freeze the async event loop. Offload them to an external process or thread pool.

```python
import asyncio
from concurrent.futures import ProcessPoolExecutor
from PIL import Image

# Global process executor pool
executor = ProcessPoolExecutor(max_workers=4)

def resize_image_sync(image_path: str, output_path: str):
    """Heavy blocking image resize operation."""
    with Image.open(image_path) as img:
        img.thumbnail((800, 800))
        img.save(output_path, "JPEG", quality=85)

async def resize_image_async(image_path: str, output_path: str):
    """Offloads the blocking resize operation to the ProcessPoolExecutor."""
    loop = asyncio.get_running_loop()
    await loop.run_in_executor(executor, resize_image_sync, image_path, output_path)
```

---

### 3. Parallel Queries (`asyncio.gather`)

Fetch independent database records in parallel to minimize overall response latencies.

```python
import asyncio
from sqlalchemy import select
from app.models.product import Product

async def get_product_details(db, slug: str, category_id: str):
    # Prepare concurrent independent selects
    product_stmt = select(Product).where(Product.slug == slug)
    related_stmt = select(Product).where(Product.category_id == category_id).limit(4)

    # Execute queries in parallel
    product_task = db.execute(product_stmt)
    related_task = db.execute(related_stmt)

    product_res, related_res = await asyncio.gather(product_task, related_task)

    product = product_res.scalars().first()
    related = list(related_res.scalars().all())
    return product, related
```

---

### 4. Async Context Managers for DB Sessions

Safely manage session lifetimes and transaction scopes:

```python
from app.database import async_session_maker

async def seed_data():
    # Enforces session close and connection return to pool on exit or error
    async with async_session_maker() as session:
        async with session.begin():  # Auto-commits or rolls back transaction block
            # perform database modifications
            pass
```

---

## Part 2: Step-by-Step VPS Deployment Checklist

### Step 1: Ubuntu System Setup

SSH into your target Ubuntu VPS and install system dependencies:

```bash
# Update repositories
sudo apt update && sudo apt upgrade -y

# Install Python 3.11, PostgreSQL, Nginx and Git
sudo apt install -y python3.11 python3.11-venv python3.11-dev git nginx postgresql postgresql-contrib

# Verify installations
python3 --version
postgres --version
nginx -v
```

---

### Step 2: Project Setup & Python dependencies

Clone the source code and build the virtual environment:

```bash
# Clone repository
cd /var/www
sudo git clone https://github.com/yourusername/meer-hamza.git
sudo chown -R $USER:$USER /var/www/meer-hamza

# Create virtual environment
cd /var/www/meer-hamza/backend
python3.11 -m venv venv
source venv/bin/activate

# Install requirements
pip install --upgrade pip
pip install -r requirements.txt
```

---

### Step 3: Configure Environment Variables

```bash
# Copy template configs
cp .env.example .env

# Edit and fill env definitions (generate secret key)
nano .env
```

---

### Step 4: Run Migrations

Ensure your Postgres instance is running and has the database created:

```bash
# Create database in postgres
sudo -u postgres psql -c "CREATE DATABASE ecommerce;"

# Run alembic migrations
source venv/bin/activate
alembic upgrade head
```

---

### Step 5: Systemd Service Configuration

Create a daemon file to keep Gunicorn running:

```bash
sudo nano /etc/systemd/system/ecommerce-api.service
```

Add the following layout:
```ini
[Unit]
Description=Gunicorn Uvicorn Daemon for FastAPI E-Commerce
After=network.target

[Service]
User=ubuntu
Group=www-data
WorkingDirectory=/var/www/meer-hamza/backend
ExecStart=/var/www/meer-hamza/backend/venv/bin/gunicorn -c gunicorn.conf.py app.main:app
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable and start the systemd daemon:
```bash
sudo systemctl daemon-reload
sudo systemctl enable ecommerce-api
sudo systemctl start ecommerce-api

# Check service status
sudo systemctl status ecommerce-api
```

---

### Step 6: Configure Nginx

Copy the Nginx configuration to configuration sites:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/ecommerce-api

# Create symbolic link to activate site config
sudo ln -s /etc/nginx/sites-available/ecommerce-api /etc/nginx/sites-enabled/

# Delete default Nginx site config
sudo rm /etc/nginx/sites-enabled/default

# Verify Nginx configuration syntax validity
sudo nginx -t

# Restart Nginx service
sudo systemctl restart nginx
```

---

### Step 7: Obtain SSL with Certbot

Secure all incoming API requests using Let's Encrypt TLS certificates:

```bash
# Install certbot
sudo apt install snapd -y
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot

# Request SSL certificate matching Nginx configuration blocks
sudo certbot --nginx -d api.meerhamza.com
```

---

### Step 8: Verify Operations

Check logs and health indicators:

```bash
# Audit FastAPI gunicorn service logs
journalctl -u ecommerce-api.service -n 50 --no-pager

# Curl local health checks
curl http://127.0.0.1:8000/health
```
