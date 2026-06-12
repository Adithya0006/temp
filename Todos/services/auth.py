def checking_service():
    return {"am ok working!..."}


from datetime import datetime, timedelta
from models import *
from fastapi import APIRouter
auth_routers = APIRouter(
    prefix="/auth",
    tags=["authRouters"]
)


@auth_routers.get("/myexample")
def myexample():
    return "sucess"

from passlib.context import CryptContext
hash_the_text = CryptContext(schemes=['bcrypt'],deprecated='auto')
def create_user(req,db):
    data = User(
        user_id = req.user_id,
        pswd = hash_the_text.hash(req.pswd),
        user_name = req.user_name
        )
    db.add(data)
    db.commit()

    return {f"{req.user_id}:{req.user_name} created sucessfully"}



def getallusers(db):
    temp_data = db.query(User).all()
    return temp_data


# from passlib.context import CryptContext
from jose import jwt

secret_key = "Adithya"
algorithm = "HS256"
def get_access_token(formdata,db):

    temp = db.query(User).filter(User.user_name == formdata.username).first()

    if not temp:
        return False

    if hash_the_text.verify(formdata.password ,temp.pswd):   #(user typed pswd(frontend),original pswd which is stored in db)
        expirytime = datetime.utcnow() + timedelta(minutes=1)
        data = {"username":formdata.username,"exp":expirytime}

        token = jwt.encode(data,secret_key,algorithm)
        return token
    else:
        return False    
    


from jose import jwt, JWTError, ExpiredSignatureError

def check_jwt_valid(token):

    try:
        payload = jwt.decode(token, secret_key, algorithms=["HS256"])

        return "token is valid"

    except ExpiredSignatureError:
        return "token expired"

    except JWTError:
        return "invalid token"