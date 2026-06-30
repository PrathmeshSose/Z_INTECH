from fastapi import FastAPI, Request, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import RedirectResponse
from pydantic import BaseModel

app = FastAPI()

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup Jinja2Templates
templates = Jinja2Templates(directory="templates")

# Mock data for demonstration purposes
requests_list = [
    {"id": 1, "title": "Setup Server", "description": "Configure the initial backend server."},
    {"id": 2, "title": "Design UI", "description": "Create the modern frontend UI."}
]



# Pydantic models for receiving POST data
class RequestItem(BaseModel):
    title: str
    description: str

class TaskItem(BaseModel):
    title: str
    description: str

@app.get("/")
async def read_root():
    """
    Redirect root to the requests dashboard.
    """
    return RedirectResponse(url="/requests")

@app.get("/requests")
async def read_requests(request: Request):
    """
    Renders requests.html.
    """
    return templates.TemplateResponse("requests.html", {"request": request, "requests": requests_list})

@app.get("/tasks")
async def read_tasks(request: Request):
    """
    Renders tasks.html using the shared requests_list.
    """
    return templates.TemplateResponse("tasks.html", {"request": request, "tasks": requests_list})

# --- Requests API ---
@app.post("/api/v1/requests")
async def create_request(item: RequestItem):
    title = item.title.strip()
    description = item.description.strip()
    
    if not title or not description:
        raise HTTPException(status_code=400, detail="Title and description cannot be empty or just spaces.")
        
    new_id = max((req["id"] for req in requests_list), default=0) + 1
    new_request = {"id": new_id, "title": title, "description": description}
    requests_list.append(new_request)
    return new_request

@app.delete("/api/v1/requests/{request_id}")
async def delete_request(request_id: int):
    for i, req in enumerate(requests_list):
        if req["id"] == request_id:
            del requests_list[i]
            return {"message": "Request deleted"}
    raise HTTPException(status_code=404, detail="Request not found")

# --- Tasks API ---
# Note: Task creation (POST) is removed because the Tasks page is view-only.
# Deleting a task deletes the underlying request.
@app.delete("/api/v1/tasks/{task_id}")
async def delete_task(task_id: int):
    for i, req in enumerate(requests_list):
        if req["id"] == task_id:
            del requests_list[i]
            return {"message": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")
