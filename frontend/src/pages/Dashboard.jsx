import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getProjects, createProject } from '../api'
import { 
  LayoutGrid, 
  Plus, 
  FolderOpen, 
  LogOut, 
  RefreshCw, 
  Loader2,
  X,
  FileText,
  AlertCircle
} from 'lucide-react'

const roleLabels = { admin: 'Admin', editor: 'Editor', lector: 'Lector' }

const roleColors = {
  admin: 'bg-[#053c46] text-white',
  editor: 'bg-[#149bb4] text-white',
  lector: 'bg-[#14788c]/20 text-[#14788c]'
}

export default function Dashboard() {
  const [projects, setProjects]     = useState([])
  const [workspace, setWorkspace]   = useState(null)
  const [user, setUser]             = useState(null)
  const [loading, setLoading]       = useState(true)
  const [showModal, setShowModal]   = useState(false)
  const [newName, setNewName]       = useState('')
  const [newDesc, setNewDesc]       = useState('')
  const [creating, setCreating]     = useState(false)
  const [error, setError]           = useState('')
  const navigate = useNavigate()

  const canCreate = workspace?.role === 'admin' || workspace?.role === 'editor'

  useEffect(() => {
    const ws    = sessionStorage.getItem('workspace')
    const usr   = sessionStorage.getItem('user')
    const token = sessionStorage.getItem('access_token')
    if (!ws || !token) { navigate('/'); return }
    setWorkspace(JSON.parse(ws))
    setUser(JSON.parse(usr))
    loadProjects(token)
  }, [])

  async function loadProjects(token) {
    try {
      const data = await getProjects(token || sessionStorage.getItem('access_token'))
      setProjects(data)
    } catch {
      setError('Error al cargar proyectos')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    if (!newName.trim()) return
    setCreating(true)
    try {
      const token = sessionStorage.getItem('access_token')
      const project = await createProject(newName, newDesc, token)
      setProjects(prev => [project, ...prev])
      setNewName(''); setNewDesc(''); setShowModal(false)
    } catch (err) {
      setError(err.message)
    } finally {
      setCreating(false)
    }
  }

  function handleLogout() {
    sessionStorage.clear()
    navigate('/')
  }

  const projectColors = [
    'bg-[#149bb4]',
    'bg-[#14788c]',
    'bg-[#053c46]',
    'bg-[#1ab4c7]',
    'bg-[#0d5c6e]'
  ]

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <header className="border-b border-[#149bb4]/10 bg-white px-4 md:px-8 h-16 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#149bb4] to-[#053c46] flex items-center justify-center shadow-md">
            <LayoutGrid className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-[#053c46] text-lg tracking-tight">Sistema SaaS Multi-Tenant</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <span className="text-sm text-[#14788c] hidden sm:block">{user?.name}</span>
          <button 
            onClick={() => { sessionStorage.removeItem('access_token'); sessionStorage.removeItem('workspace'); navigate('/workspaces') }}
            className="flex items-center gap-2 bg-[#f7f9fb] border border-[#149bb4]/20 text-[#14788c] px-3 py-2 rounded-lg text-sm font-medium hover:bg-[#149bb4]/10 hover:border-[#149bb4]/30 transition-all duration-200"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Cambiar workspace</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-[#14788c] hover:text-[#053c46] px-2 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4 animate-[fadeIn_0.5s_ease-out]">
          <div>
            <p className="text-[#14788c] text-xs font-medium mb-1 flex items-center gap-1">
              <LayoutGrid className="w-3 h-3" />
              Workspace activo
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-[#053c46] tracking-tight mb-2">
              {workspace?.name}
            </h1>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${roleColors[workspace?.role] || 'bg-gray-100 text-gray-600'}`}>
              {roleLabels[workspace?.role]}
            </span>
          </div>
          {/* Boton crear - solo visible si Admin o Editor */}
          {canCreate && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-[#149bb4] to-[#14788c] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-[#149bb4]/25 hover:shadow-xl hover:shadow-[#149bb4]/30 hover:scale-[1.02] transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Crear Proyecto
            </button>
          )}
        </div>
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16 text-[#14788c]">
            <Loader2 className="w-8 h-8 animate-spin mb-3" />
            <p className="text-sm">Cargando proyectos...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 px-6 border-2 border-dashed border-[#149bb4]/20 rounded-2xl bg-white/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#149bb4]/10 flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-[#149bb4]" />
            </div>
            <p className="font-semibold text-[#053c46] mb-1">Sin proyectos aun</p>
            <p className="text-sm text-[#14788c]">
              {canCreate ? 'Crea el primero con el boton de arriba.' : 'No hay proyectos en este workspace.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p, i) => (
              <div
                key={p.id}
                className="group bg-white border border-[#149bb4]/10 rounded-xl p-5 shadow-sm hover:shadow-lg hover:shadow-[#149bb4]/10 hover:border-[#149bb4]/30 transition-all duration-300 cursor-pointer"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div className={`w-10 h-10 rounded-lg ${projectColors[i % projectColors.length]} mb-4 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-200`}>
                  <FolderOpen className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-[#053c46] mb-1 group-hover:text-[#149bb4] transition-colors duration-200">
                  {p.name}
                </h3>
                <p className="text-sm text-[#14788c] leading-relaxed line-clamp-2">
                  {p.description || 'Sin descripcion'}
                </p>
              </div>
            ))}
          </div>
        )}

        {error && (
          <div className="mt-4 flex items-center gap-2 text-red-500 text-sm bg-red-50 px-4 py-3 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </main>

      {/* Modal crear proyecto */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#053c46]/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#149bb4] to-[#053c46] flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h2 className="font-bold text-[#053c46] text-lg">Nuevo Proyecto</h2>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-lg bg-[#f7f9fb] flex items-center justify-center text-[#14788c] hover:bg-[#149bb4]/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-medium text-[#14788c] mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  placeholder="Nombre del proyecto"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  required
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl border border-[#149bb4]/20 bg-[#f7f9fb] text-[#053c46] placeholder-[#14788c]/50 focus:outline-none focus:ring-2 focus:ring-[#149bb4]/30 focus:border-[#149bb4] transition-all duration-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[#14788c] mb-2">
                  Descripcion (opcional)
                </label>
                <textarea
                  placeholder="Describe el proyecto..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-[#149bb4]/20 bg-[#f7f9fb] text-[#053c46] placeholder-[#14788c]/50 focus:outline-none focus:ring-2 focus:ring-[#149bb4]/30 focus:border-[#149bb4] transition-all duration-200 resize-none"
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 rounded-xl border border-[#149bb4]/20 bg-[#f7f9fb] text-[#14788c] font-semibold hover:bg-[#149bb4]/10 transition-all duration-200"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={creating}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-[#149bb4] to-[#14788c] text-white font-semibold shadow-lg shadow-[#149bb4]/25 hover:shadow-xl hover:shadow-[#149bb4]/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creando...
                    </>
                  ) : (
                    'Crear'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
