import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { exchangeToken } from '../api'
import {
  User,
  Briefcase,
  ChevronRight,
  ArrowLeft,
  AlertCircle,
  Lock
} from 'lucide-react'

const roleLabels = { admin: 'Admin', editor: 'Editor', lector: 'Lector' }

const roleColors = {
  admin: 'bg-[#053c46] text-white',
  editor: 'bg-[#149bb4] text-white',
  lector: 'bg-[#14788c] text-white'
}

export default function WorkspaceSelector() {
  const [workspaces, setWorkspaces] = useState([])
  const [user, setUser]             = useState(null)
  const [loading, setLoading]       = useState(null)
  const [error, setError]           = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const ws   = sessionStorage.getItem('workspaces')
    const usr  = sessionStorage.getItem('user')
    const token = sessionStorage.getItem('temp_token')
    if (!ws || !token) { navigate('/'); return }
    setWorkspaces(JSON.parse(ws))
    setUser(JSON.parse(usr))
  }, [])

  async function handleSelect(workspace) {
    setError('')
    setLoading(workspace.id)
    try {
      const tempToken = sessionStorage.getItem('temp_token')
      const data = await exchangeToken(workspace.id, tempToken)
      sessionStorage.setItem('access_token', data.access_token)
      sessionStorage.setItem('workspace', JSON.stringify({ id: workspace.id, name: workspace.name, role: workspace.role }))
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f7f9fb] relative overflow-hidden">
      <div className="w-full max-w-[440px] relative z-10 animate-[fadeIn_0.5s_ease-out]">
        <div className="bg-white rounded-2xl p-7 mb-4 shadow-lg shadow-[#053c46]/[0.08] border border-[#149bb4]/10 animate-[slideDown_0.4s_ease-out]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-[14px] bg-gradient-to-br from-[#149bb4] to-[#053c46] flex items-center justify-center flex-shrink-0 ring-4 ring-[#149bb4]/20">
              <User className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-[#14788c] text-[0.8rem] mb-0.5 font-medium">
                Bienvenido de nuevo
              </p>
              <h1 className="text-2xl font-bold text-[#053c46] tracking-tight">
                {user?.name || 'Usuario'}
              </h1>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-7 shadow-lg shadow-[#053c46]/[0.08] border border-[#149bb4]/10 animate-[slideUp_0.5s_ease-out]">
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-1">
              <Briefcase className="w-[18px] h-[18px] text-[#149bb4]" />
              <h2 className="text-base font-semibold text-[#053c46]">
                Selecciona un workspace
              </h2>
            </div>
            <p className="text-[0.8rem] text-[#14788c]">
              Elige el espacio de trabajo donde deseas continuar
            </p>
          </div>

          {/* Workspace List */}
          <div className="flex flex-col gap-3">
            {workspaces.map((ws, i) => (
              <button
                key={ws.id}
                onClick={() => handleSelect(ws)}
                disabled={loading !== null}
                className={`
                  bg-[#f7f9fb] rounded-xl p-4 flex items-center justify-between text-left
                  transition-all duration-200 
                  ${loading === ws.id ? 'bg-[#149bb4]/5 border-2 border-[#149bb4]' : 'border-2 border-transparent hover:bg-[#149bb4]/[0.08] hover:border-[#149bb4]'}
                  ${loading !== null && loading !== ws.id ? 'opacity-50' : 'opacity-100'}
                  ${loading !== null ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-3.5">
                  {/* Workspace Icon */}
                  <div className="w-11 h-11 rounded-[10px] bg-gradient-to-br from-[#149bb4] to-[#053c46] flex items-center justify-center text-lg font-bold text-white flex-shrink-0 shadow-md shadow-[#149bb4]/25">
                    {ws.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[0.95rem] text-[#053c46] mb-1">
                      {ws.name}
                    </p>
                    <span className={`inline-block px-2.5 py-0.5 rounded-md text-[0.7rem] font-semibold uppercase tracking-wide ${roleColors[ws.role] || 'bg-[#149bb4] text-white'}`}>
                      {roleLabels[ws.role]}
                    </span>
                  </div>
                </div>

                {loading === ws.id ? (
                  <div className="w-5 h-5 border-2 border-[#149bb4]/20 border-t-[#149bb4] rounded-full animate-spin" />
                ) : (
                  <ChevronRight className="w-5 h-5 text-[#14788c]" />
                )}
              </button>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-3 bg-red-500/[0.08] border border-red-500/20 rounded-[10px] flex items-center gap-2 animate-[shake_0.4s_ease-out]">
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <p className="text-[0.85rem] text-red-500">
                {error}
              </p>
            </div>
          )}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-[#149bb4]/20 to-transparent my-6" />

          {/* Back to Login */}
          <button
            onClick={() => { sessionStorage.clear(); navigate('/') }}
            className="w-full bg-transparent border-none text-[#14788c] text-[0.85rem] cursor-pointer flex items-center justify-center gap-2 p-2 rounded-lg transition-all duration-200 hover:bg-[#149bb4]/5 hover:text-[#053c46]"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al login
          </button>
        </div>
        <div className="text-center mt-5 animate-[fadeIn_0.6s_ease-out_0.3s_both]">
          <p className="text-xs text-[#14788c] flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3" />
            Conexion segura
          </p>
        </div>
      </div>
    </div>
  )
}
