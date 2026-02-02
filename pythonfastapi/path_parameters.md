



---

# 📘 FastAPI – Paths, Routes & Path Parameters (Notes)

## 1. Modern Web Framework URLs

Modern web frameworks like **FastAPI** use **routes/endpoints** instead of file-based URLs.

Example:

```
http://localhost:8000/hello/TutorialsPoint
```

* `/hello/TutorialsPoint` → **Path / Route**
* A path is the part of the URL **after the first `/`**

This makes URLs:

* Easy to remember
* Flexible
* Dynamic

---

## 2. Path and Route in FastAPI

In FastAPI:

* A **path** (or route) is defined using a **string**
* It is passed to a **path operation decorator**

Example:

```python
@app.get("/")
```

* `/` → path
* `get` → operation (HTTP method)

---

## 3. Path Operation & Decorator

A **path operation** combines:

1. **HTTP method** (GET, POST, etc.)
2. **Path**
3. **Function to execute**

Example:

```python
@app.get("/")
def index():
    return {"message": "Hello World"}
```

### Terminology:

* `get` → operation
* `"/"` → path
* `@app.get("/")` → path operation decorator
* `index()` → path operation function

---

## 4. Common HTTP Methods

| Method | Description                                           |
| ------ | ----------------------------------------------------- |
| GET    | Sends data in unencrypted form, used to retrieve data |
| POST   | Sends form or JSON data to server                     |
| PUT    | Updates/replaces existing data                        |
| DELETE | Deletes data                                          |
| HEAD   | Same as GET but without response body                 |

---

## 5. async vs normal function

Path operation functions can be:

```python
async def func():
```

or

```python
def func():
```

* `async` → non-blocking, better for I/O operations
* `def` → normal synchronous execution
* Both are valid in FastAPI

---

## 6. Returning Responses

* FastAPI automatically converts Python data to **JSON**
* Can return:

  * dict
  * list
  * string
  * Pydantic model

Example:

```python
return {"name": "Adithya"}
```

---

## 7. Path Parameters

Path parameters allow **dynamic values** in URLs.

Example path:

```python
@app.get("/hello/{name}")
```

Example URL:

```
http://localhost:8000/hello/Adithya
```

Code:

```python
@app.get("/hello/{name}")
async def hello(name):
    return {"name": name}
```

Response:

```json
{"name": "Adithya"}
```

---

## 8. Multiple Path Parameters

Multiple parameters are separated using `/`

```python
@app.get("/hello/{name}/{age}")
async def hello(name, age):
    return {"name": name, "age": age}
```

URL:

```
http://localhost:8000/hello/Ravi/20
```

Response:

```json
{"name": "Ravi", "age": "20"}
```

---

## 9. Path Parameters with Type Hints

Python type hints can be used for validation.

```python
@app.get("/hello/{name}/{age}")
async def hello(name: str, age: int):
    return {"name": name, "age": age}
```

### Benefits:

* Automatic validation
* Clear error messages
* Swagger documentation

❌ Invalid URL:

```
/hello/20/Ravi
```

Response:

```json
{
  "detail": [
    {
      "loc": ["path", "age"],
      "msg": "value is not a valid integer",
      "type": "type_error.integer"
    }
  ]
}
```

---

## 10. HEAD Method Example

```python
@app.head("/{name}/{age}")
def func(name: str, age: int):
    print("name:", name, "age:", age)
```

* Executes function
* Prints output in terminal
* **Does not return response body to browser**

Used mainly for:

* Checking resource existence
* Checking headers

---

## 11. Swagger / OpenAPI Docs

FastAPI automatically generates API documentation.

Access:

```
http://localhost:8000/docs
```

Features:

* Lists all routes
* Shows parameters and types
* Allows testing APIs using **Try it out**

---

## 12. Key Points (Quick Revision)

* FastAPI uses **routes instead of files**
* Path = URL after `/`
* Decorators map URL + HTTP method to function
* `{}` is used for path parameters
* Type hints enable validation
* Swagger docs are auto-generated
* HEAD returns headers only, no body

---


