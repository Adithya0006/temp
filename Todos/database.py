from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.engine import URL
from sqlalchemy.ext.declarative import declarative_base
db_url = URL.create(
    drivername="postgresql",
    username="postgres",
    password="bel123",   # ⚠️ avoid hardcoding passwords in production
    host="localhost",
    # port=5432,
    # host="localhost",
    database="TODOS"
)

# Create the engine
engine = create_engine(db_url)

# Create a configured "Session" class
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base=declarative_base()