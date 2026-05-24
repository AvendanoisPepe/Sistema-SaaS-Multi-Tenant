from fastapi import APIRouter, HTTPException, Depends
from typing import List

from auth import get_current_user
from database import get_connection
from models import ProjectCreate, ProjectResponse

router = APIRouter()

# ── Endpoint 3: GET /api/projects ───────────────────────────────

@router.get("", response_model=List[ProjectResponse])
def get_projects(current_user: dict = Depends(get_current_user)):
    if current_user.get("type") != "access":
        raise HTTPException(status_code=401, detail="Token de acceso requerido")

    workspace_id = current_user["workspace_id"]
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("SELECT * FROM projects WHERE workspace_id = %s", (workspace_id,))
    projects = cur.fetchall()
    cur.close()
    conn.close()

    return [ProjectResponse(**p) for p in projects]

# ── Endpoint 4: POST /api/projects ──────────────────────────────

@router.post("", response_model=ProjectResponse, status_code=201)
def create_project(body: ProjectCreate, current_user: dict = Depends(get_current_user)):
    if current_user.get("type") != "access":
        raise HTTPException(status_code=401, detail="Token de acceso requerido")
    
    # Lector no puede crear proyectos
    if current_user["role"] == "lector":
        raise HTTPException(status_code=403, detail="No tienes permisos para crear proyectos")

    workspace_id = current_user["workspace_id"]
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO projects (name, description, workspace_id)
        VALUES (%s, %s, %s)
        RETURNING *
    """, (body.name, body.description, workspace_id))
    new_project = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return ProjectResponse(**new_project)