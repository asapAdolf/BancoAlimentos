import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, LogIn, Leaf, Info } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { validarCorreo, validarContrasenaLogin } from '../services/validaciones'

export default function PaginaLogin() {
  const { iniciarSesion } = useAuth()
  const navegar = useNavigate()

  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [verContrasena, setVerContrasena] = useState(false)
  const [errores, setErrores] = useState<{ correo?: string; contrasena?: string }>({})

  const enviar = (e: FormEvent) => {
    e.preventDefault()

    // Solo validamos que los campos estén bien escritos (validación de interfaz).
    const nuevosErrores = {
      correo: validarCorreo(correo),
      contrasena: validarContrasenaLogin(contrasena),
    }
    setErrores(nuevosErrores)
    if (nuevosErrores.correo || nuevosErrores.contrasena) return

    iniciarSesion(correo)
    navegar('/app')
  }

  return (
    <section className="auth">
      <div className="auth-tarjeta">
        <div className="auth-encabezado">
          <span className="logo-icono">
            <Leaf size={22} />
          </span>
          <h1>Bienvenido de nuevo</h1>
          <p>Inicia sesión para explorar, reservar o publicar alimentos.</p>
        </div>

        <form onSubmit={enviar} noValidate>
          <div className="campo">
            <label htmlFor="correo">Correo electrónico</label>
            <div className={`campo-entrada ${errores.correo ? 'con-error' : ''}`}>
              <Mail size={18} />
              <input
                id="correo"
                type="email"
                placeholder="nombre@correo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                autoComplete="email"
              />
            </div>
            {errores.correo && <small className="error-texto">{errores.correo}</small>}
          </div>

          <div className="campo">
            <label htmlFor="contrasena">Contraseña</label>
            <div className={`campo-entrada ${errores.contrasena ? 'con-error' : ''}`}>
              <Lock size={18} />
              <input
                id="contrasena"
                type={verContrasena ? 'text' : 'password'}
                placeholder="Tu contraseña"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="btn-ojo"
                aria-label={verContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                onClick={() => setVerContrasena(!verContrasena)}
              >
                {verContrasena ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errores.contrasena && <small className="error-texto">{errores.contrasena}</small>}
          </div>

          <button type="submit" className="btn btn-primario btn-completo">
            <LogIn size={18} /> Iniciar sesión
          </button>
        </form>

        <p className="auth-pie">
          ¿Aún no tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>

        <div className="caja-demo">
          <Info size={18} />
          <div>
            <strong>Modo demostración</strong>
            <p>Escribe cualquier contraseña. Para ver cada perfil usa:</p>
            <p>persona@demo.mx · organizacion@demo.mx · panaderia@demo.mx</p>
          </div>
        </div>
      </div>
    </section>
  )
}
