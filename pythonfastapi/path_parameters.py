from fastapi import FastAPI


app=FastAPI()

@app.get("/")
def func():
    temp= {"data":{"name":"adithya","age":"23","role":"JST1"}}
    return temp["data"]["name"]


@app.head("/{name}/{age}")
def func(name:str,age:int):
    print("name: ",name," age: ",age)
    # return f"my name is {name} and my age is {age} yrs"