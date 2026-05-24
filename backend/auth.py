import os
from datetime import datetime, timedelta

from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from passlib.context import CryptContext

from database import get_connection
from models import LoginRequest, LoginResponse, TokenRequest, TokenResponse, WorkspaceInfo

# ── Configuración ────────────────────────────────────────────────
SECRET_KEY = os.getenv("SECRET_KEY", "supersecretkey123")
ALGORITHM = "HS256"

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
bearer_scheme = HTTPBearer()
router = APIRouter()

# ── Utilidades JWT ───────────────────────────────────────────────

def create_token(data: dict, expires_minutes: int = 60) -> str:
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(minutes=expires_minutes)
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError:
        raise HTTPException(status_code=401, detail="Token inválido o expirado")

# ── Dependencia: extrae el payload del token en cada request ─────

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    return decode_token(credentials.credentials)

# ── Endpoint 1: POST /api/auth/login ────────────────────────────

@router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest):
    conn = get_connection()
    cur = conn.cursor()

    # Buscar usuario por email
    cur.execute("SELECT * FROM users WHERE email = %s", (body.email,))
    user = cur.fetchone()

    if not user or not pwd_context.verify(body.password, user["password"]):
        raise HTTPException(status_code=401, detail="Credenciales incorrectas")

    # Buscar los workspaces a los que pertenece
    cur.execute("""
        SELECT w.id, w.name, uw.role
        FROM workspaces w
        JOIN user_workspaces uw ON w.id = uw.workspace_id
        WHERE uw.user_id = %s
    """, (user["id"],))
    workspaces = cur.fetchall()
    cur.close()
    conn.close()

    # Convertimos el id a string para evitar problemas de serialización en JWT
    temp_token = create_token({"sub": str(user["id"]), "type": "temp"}, expires_minutes=10)

    return LoginResponse(
        user_id=user["id"],
        name=user["name"],
        email=user["email"],
        workspaces=[WorkspaceInfo(**w) for w in workspaces],
        temp_token=temp_token
    )

# ── Endpoint 2: POST /api/auth/token ────────────────────────────

@router.post("/token", response_model=TokenResponse)
def exchange_token(body: TokenRequest, credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)):
    payload = decode_token(credentials.credentials)

    # Validar que sea un token temporal
    if payload.get("type") != "temp":
        raise HTTPException(status_code=400, detail="Se esperaba un token temporal")

    user_id = payload["sub"]
    conn = get_connection()
    cur = conn.cursor()

    # Verificar que el usuario realmente pertenece a ese workspace
    cur.execute("""
        SELECT role FROM user_workspaces
        WHERE user_id = %s AND workspace_id = %s
    """, (user_id, body.workspace_id))
    result = cur.fetchone()
    cur.close()
    conn.close()

    if not result:
        raise HTTPException(status_code=403, detail="No tienes acceso a este workspace")

    # Token final: incluye workspace_id y rol
    access_token = create_token({
        "sub": user_id,
        "workspace_id": body.workspace_id,
        "role": result["role"],
        "type": "access"
    })

    return TokenResponse(access_token=access_token)