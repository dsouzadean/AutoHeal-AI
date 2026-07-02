from database.database import engine
from database.models import Base


def initialize_database():

    Base.metadata.create_all(bind=engine)

    print("Database initialized.")