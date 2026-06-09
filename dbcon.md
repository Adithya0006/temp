For a **production-style FastAPI project**, I recommend this structure. You can copy it for almost every project.

## Project Structure

```text
fastapi-project/
│
├── app/
│   ├── main.py
│   │
│   ├── core/
│   │   └── config.py
│   │
│   ├── db/
│   │   └── database.py
│   │
│   ├── models/
│   │   └── user.py
│   │
│   ├── schemas/
│   │   └── user.py
│   │
│   ├── routers/
│   │   └── user.py
│   │
│   └── services/
│       └── user_service.py
│
├── requirements.txt
└── .env
```

---

# 1. `.env`

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/mydb
```

---

# 2. `app/core/config.py`

```python
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
```

---

# 3. `app/db/database.py`

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
```

---

# 4. `app/models/user.py`

```python
from sqlalchemy import Column, Integer, String

from app.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)

    email = Column(
        String,
        unique=True,
        nullable=False
    )
```

---

# 5. `app/schemas/user.py`

Pydantic schemas

```python
from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str


class UserResponse(BaseModel):
    id: int
    name: str
    email: str

    class Config:
        from_attributes = True
```

---

# 6. `app/services/user_service.py`

Business Logic Layer

```python
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate


def create_user(
    db: Session,
    user_data: UserCreate
):
    user = User(
        name=user_data.name,
        email=user_data.email
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def get_users(db: Session):
    return db.query(User).all()
```

---

# 7. `app/routers/user.py`

Endpoints Layer

```python
from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db

from app.schemas.user import (
    UserCreate,
    UserResponse
)

from app.services.user_service import (
    create_user,
    get_users
)

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)


@router.post(
    "/",
    response_model=UserResponse
)
def add_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    return create_user(db, user)


@router.get(
    "/",
    response_model=list[UserResponse]
)
def fetch_users(
    db: Session = Depends(get_db)
):
    return get_users(db)
```

---

# 8. `app/main.py`

Application Entry Point

```python
from fastapi import FastAPI
from sqlalchemy import text

from app.db.database import (
    engine,
    Base
)

from app.routers.user import router as user_router

app = FastAPI(
    title="My API"
)

# Create tables
Base.metadata.create_all(bind=engine)


@app.on_event("startup")
def startup():

    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))

        print("✅ DB Connected")

    except Exception as e:
        print("❌ DB Failed")
        print(e)


@app.get("/health")
def health():
    return {
        "status": "success"
    }


app.include_router(user_router)
```

---

# 9. `requirements.txt`

```text
fastapi
uvicorn
sqlalchemy
psycopg2-binary
python-dotenv
pydantic
```

---

# Run

```bash
pip install -r requirements.txt
```

```bash
uvicorn app.main:app --reload
```

---

# API Flow (important for interviews)

```text
Request
   ↓
Router
   ↓
Service
   ↓
Database
   ↓
Response
```

Example:

```text
POST /users

Router
  ↓
create_user()
  ↓
SQLAlchemy Model
  ↓
PostgreSQL
  ↓
JSON Response
```

This is the structure used in many real-world FastAPI codebases and is a solid template to keep and reuse for future projects.
