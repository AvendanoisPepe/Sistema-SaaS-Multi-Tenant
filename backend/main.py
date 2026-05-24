from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import auth
import projects

app = FastAPI(title="SaaS Multi-Tenant API", redirect_slashes=False)

# CORS: permite que el frontend (React) pueda llamar al backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registrar rutas
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])

@app.get("/")
def root():
    return {"status": "ok", "message": "SaaS API corriendo"}