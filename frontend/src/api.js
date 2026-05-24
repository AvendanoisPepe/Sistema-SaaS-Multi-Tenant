// Sin BASE url — Vite proxy redirige /api al backend automáticamente
const BASE = ''

// Paso 1: Login con email y password
export async function login(email, password) {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  if (!res.ok) throw new Error('Credenciales incorrectas')
  return res.json()
}

// Paso 2: Intercambio de contexto
export async function exchangeToken(workspaceId, tempToken) {
  const res = await fetch(`${BASE}/api/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tempToken}`
    },
    body: JSON.stringify({ workspace_id: workspaceId })
  })
  if (!res.ok) throw new Error('Error al seleccionar workspace')
  return res.json()
}

// Paso 3: Obtener proyectos
export async function getProjects(accessToken) {
  const res = await fetch(`${BASE}/api/projects`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  })
  if (!res.ok) throw new Error('Error al cargar proyectos')
  return res.json()
}

// Paso 4: Crear proyecto
export async function createProject(name, description, accessToken) {
  const res = await fetch(`${BASE}/api/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ name, description })
  })
  if (!res.ok) throw new Error('No tienes permisos para crear proyectos')
  return res.json()
}

// Paso 5: Eliminar proyecto
export async function deleteProject(projectId, accessToken) {
  const res = await fetch (`${BASE}/api/projects/${projectId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${accessToken}` }
  })
  if (!res.ok) throw new Error('No tienes permisos para eliminar este proyecto')
  return res.json()
}