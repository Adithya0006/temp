from fastapi import FastAPI


app=FastAPI()


# Query parameters are inputs provided by the client to the server to control filtering, sorting, pagination, or behavior of a request.
@app.get("/")
def func():
    return "hello"


@app.get("/home")
def func(name:str,age:int):   #here we r reciving name,age as input from the client side!
    return {"name":name,"age":age}

