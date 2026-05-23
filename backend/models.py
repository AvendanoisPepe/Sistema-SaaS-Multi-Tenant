from pydantic import BaseModel
from typing import List, Optional

# ── REQUEST bodies (lo que llega del frontend) ──────────────────

class LoginRequest(BaseModel):
    email: str
    password: str

class TokenRequest(BaseModel):
    workspace_id: int

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None

# ── RESPONSE bodies (lo que devolvemos al frontend) ─────────────

class WorkspaceInfo(BaseModel):
    id: int
    name: str
    role: str

class LoginResponse(BaseModel):
    user_id: int
    name: str
    email: str
    workspaces: List[WorkspaceInfo]
    temp_token: str          # token temporal solo para elegir workspace

class TokenResponse(BaseModel):
    access_token: str        # token final con workspace y rol adentro
    token_type: str = "bearer"

class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    workspace_id: int