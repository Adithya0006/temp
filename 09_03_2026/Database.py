from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker

# Define your database connection URL
db_url = URL.create(
    drivername="postgresql",
    username="postgres",
    password="bel123",   # ⚠️ avoid hardcoding passwords in production
    host="localhost",
    # port=5432,
    # host="localhost",
    database="INDUSTRY4.0BEL"
)

# Create the engine
engine = create_engine(db_url)

# Create a configured "Session" class
session = sessionmaker(bind=engine)