import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../api'
import { 
  LayoutGrid, 
  LogIn, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  ArrowRight,
  Info,
  Shield
} from 'lucide-react'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await login(email, password)
      sessionStorage.setItem('temp_token', data.temp_token)
      sessionStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }))
      sessionStorage.setItem('workspaces', JSON.stringify(data.workspaces))
      navigate('/workspaces')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#f7f9fb] relative overflow-hidden">
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 animate-[fadeInUp_0.5s_ease-out]">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#149bb4] to-[#053c46] ring-2 ring-[#149bb4]/20 mb-4">
            <LayoutGrid className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[#053c46] tracking-tight">
            Prueba Técnica Desarrollador Full Stack 
          </h1>
          <p className="text-[#14788c] text-sm mt-1">
            Sistema SaaS Multi-Tenant
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl shadow-[#053c46]/5 border border-[#149bb4]/10 p-8 animate-[fadeInUp_0.7s_ease-out]">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-[#149bb4]/10 flex items-center justify-center">
              <LogIn className="w-5 h-5 text-[#149bb4]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#053c46]">
                Iniciar sesion
              </h2>
              <p className="text-xs text-[#14788c]">
                Accede a tu cuenta
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#053c46] flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-[#14788c]" />
                Correo electronico
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 pl-11 rounded-xl border border-[#149bb4]/20 bg-[#f7f9fb] text-[#053c46] placeholder:text-[#14788c]/50 focus:outline-none focus:ring-2 focus:ring-[#149bb4]/30 focus:border-[#149bb4] transition-all duration-200"
                  type="email"
                  placeholder="juan@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#14788c]">
                  <User className="w-[18px] h-[18px]" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#053c46] flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#14788c]" />
                Contrasena
              </label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 pl-11 pr-11 rounded-xl border border-[#149bb4]/20 bg-[#f7f9fb] text-[#053c46] placeholder:text-[#14788c]/50 focus:outline-none focus:ring-2 focus:ring-[#149bb4]/30 focus:border-[#149bb4] transition-all duration-200"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#14788c]">
                  <Lock className="w-[18px] h-[18px]" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#14788c] hover:text-[#149bb4] transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-[18px] h-[18px]" />
                  ) : (
                    <Eye className="w-[18px] h-[18px]" />
                  )}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm animate-[fadeIn_0.3s_ease-out]">
                <AlertCircle className="w-[18px] h-[18px] flex-shrink-0" />
                {error}
              </div>
            )}
            <button
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-[#149bb4] to-[#14788c] text-white font-semibold shadow-lg shadow-[#149bb4]/25 hover:shadow-xl hover:shadow-[#149bb4]/30 hover:from-[#14788c] hover:to-[#053c46] focus:outline-none focus:ring-2 focus:ring-[#149bb4]/50 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 mt-2"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Ingresando...
                </>
              ) : (
                <>
                  Ingresar
                  <ArrowRight className="w-[18px] h-[18px]" />
                </>
              )}
            </button>
          </form>
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#149bb4]/20 to-transparent" />
            <span className="text-xs text-[#14788c]">Info</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#149bb4]/20 to-transparent" />
          </div>
          <div className="p-4 rounded-xl bg-gradient-to-br from-[#149bb4]/5 to-[#053c46]/5 border border-[#149bb4]/15">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#149bb4]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Info className="w-4 h-4 text-[#149bb4]" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-semibold text-[#053c46] mb-2">
                  Credenciales de prueba
                </p>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-[#14788c]">
                    <Mail className="w-3 h-3" />
                    <code className="px-2 py-0.5 rounded text-[#053c46] text-xs">juan@example.com</code>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#14788c]">
                    <Lock className="w-3 h-3" />
                    <code className="px-2 py-0.5 rounded text-[#053c46] text-xs">password123</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-[#14788c]/60 mt-6 flex items-center justify-center gap-1.5">
          <Shield className="w-3 h-3" />
          Seguro y protegido con cifrado de extremo a extremo
        </p>
      </div>
    </div>
  )
}
