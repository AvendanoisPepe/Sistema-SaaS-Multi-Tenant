# ProjectSpace — SaaS Multi-Tenant

Sistema de gestión de proyectos con soporte multi-workspace y control de acceso por roles.

## Stack

| Capa | Tecnología |
|------|-----------|
| Backend | Python + FastAPI |
| Base de datos | PostgreSQL 16 |
| Frontend | React + Vite + Tailwind CSS |
| Contenedores | Docker + Docker Compose |

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y corriendo

No se necesita instalar Python, Node.js ni PostgreSQL localmente.

## Ejecución

Clona el repositorio y ejecuta en la raíz del proyecto:

```bash
docker compose up --build
```

La primera vez tarda unos minutos mientras Docker descarga las imágenes. Cuando veas esto en la terminal, todo está listo:

```
frontend-1  | VITE ready
backend-1   | Application startup complete.
db-1        | database system is ready to accept connections
```

Abre el navegador en:

- **Frontend** → http://localhost:3000
- **Backend** → http://localhost:8000

## Credenciales de prueba

| Campo | Valor |
|-------|-------|
| Email | `juan@example.com` |
| Password | `password123` |

## Datos pre-cargados

| Workspace | Rol |
|-----------|-----|
| Workspace Alfa | Admin (puede crear, editar y eliminar proyectos) |
| Workspace Beta | Lector (solo puede ver proyectos) |

Cada workspace tiene 2 proyectos de ejemplo.

## Endpoints del API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/login` | Autentica al usuario, retorna workspaces y token temporal |
| POST | `/api/auth/token` | Recibe workspace elegido, retorna token de acceso final |
| GET | `/api/projects` | Lista proyectos del workspace activo |
| POST | `/api/projects` | Crea un proyecto (requiere rol Admin o Editor) |

## Flujo de autenticación

```
1. Login → token temporal (10 min)
2. Elegir workspace → token definitivo (contiene workspace_id y rol)
3. Todas las peticiones usan el token definitivo
```

## Estructura del proyecto

```
Sistema-SaaS-Multi-Tenant/
├── backend/
│   ├── main.py
│   ├── auth.py
│   ├── projects.py
│   ├── models.py
│   ├── database.py
│   ├── requirements.txt
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── WorkspaceSelector.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── Dockerfile
├── db/
│   └── init.sql
├── docker-compose.yml
└── README.md
```

## Detener la aplicación

```bash
docker compose down
```

Para detener y eliminar los volúmenes (resetea la base de datos):

```bash
docker compose down -v
```