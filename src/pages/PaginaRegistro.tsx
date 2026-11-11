import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Phone,
  User,
  Store,
  UserPlus,
  Leaf,
  UserRound,
  HeartHandshake,
  Utensils,
  Coffee,
  Croissant,
  ShoppingCart,
  type LucideIcon,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  ETIQUETAS_TIPO,
  esEstablecimiento,
  type TipoUsuario,
} from '../types/usuario'
import {
  validarNombre,
  validarCorreo,
  validarContrasenaRegistro,
  validarTelefono,
} from '../services/validaciones'

const iconosTipo: Record<TipoUsuario, LucideIcon> = {
  persona: UserRound,
  organizacion: HeartHandshake,
  restaurante: Utensils,
  cafeteria: Coffee,
  panaderia: Croissant,
  supermercado: ShoppingCart,
}

const tipos = Object.keys(ETIQUETAS_TIPO) as TipoUsuario[]

interface Errores {
  nombre?: string
  correo?: string
  contrasena?: string
  telefono?: string
  nombreEstablecimiento?: string
}

export default function PaginaRegistro() {
  const { registrar } = useAuth()
  const navegar = useNavigate()

  const [tipo, setTipo] = useState<TipoUsuario>('persona')
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [telefono, setTelefono] = useState('')
  const [nombreEstablecimiento, setNombreEstablecimiento] = useState('')
  const [verContrasena, setVerContrasena] = useState(false)
  const [errores, setErrores] = useState<Errores>({})

  // El campo "nombre del establecimiento" solo aparece para negocios.
  const pideEstablecimiento = esEstablecimiento(tipo)

  const enviar = (e: FormEvent) => {
    e.preventDefault()

    const nuevosErrores: Errores = {
      nombre: validarNombre(nombre),
      correo: validarCorreo(correo),
      contrasena: validarContrasenaRegistro(contrasena),
      telefono: validarTelefono(telefono),
      nombreEstablecimiento: pideEstablecimiento
        ? validarNombre(nombreEstablecimiento)
        : '',
    }
    setErrores(nuevosErrores)
    if (Object.values(nuevosErrores).some(Boolean)) return

    // Estado simulado de interfaz: no se envía nada a ningún servidor.
    registrar({
      nombre: nombre.trim(),
      correo: correo.trim(),
      telefono: telefono.replace(/\s/g, ''),
      tipo,
      nombreEstablecimiento: pideEstablecimiento ? nombreEstablecimiento.trim() : undefined,
    })
    navegar('/app')
  }

  return (
    <section className="auth">
      <div className="auth-tarjeta auth-ancha">
        <div className="auth-encabezado">
          <span className="logo-icono">
            <Leaf size={22} />
          </span>
          <h1>Crea tu cuenta</h1>
          <p>Únete a la comunidad que rescata alimentos.</p>
        </div>

        <form onSubmit={enviar} noValidate>
          <div className="campo">
            <label>¿Cómo participarás?</label>
            <div className="tipos-usuario" role="radiogroup" aria-label="Tipo de usuario">
              {tipos.map((t) => {
                const Icono = iconosTipo[t]
                return (
                  <button
                    type="button"
                    key={t}
                    role="radio"
                    aria-checked={tipo === t}
                    className={`tipo-opcion ${tipo === t ? 'seleccionado' : ''}`}
                    onClick={() => setTipo(t)}
                  >
                    <Icono size={22} />
                    <span>{ETIQUETAS_TIPO[t]}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rejilla-dos">
            <div className="campo">
              <label htmlFor="nombre">Nombre completo</label>
              <div className={`campo-entrada ${errores.nombre ? 'con-error' : ''}`}>
                <User size={18} />
                <input
                  id="nombre"
                  type="text"
                  placeholder="Tu nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  autoComplete="name"
                />
              </div>
              {errores.nombre && <small className="error-texto">{errores.nombre}</small>}
            </div>

            <div className="campo">
              <label htmlFor="telefono">Teléfono</label>
              <div className={`campo-entrada ${errores.telefono ? 'con-error' : ''}`}>
                <Phone size={18} />
                <input
                  id="telefono"
                  type="tel"
                  placeholder="10 dígitos"
                  value={telefono}
                  onChange={(e) => setTelefono(e.target.value)}
                  autoComplete="tel"
                />
              </div>
              {errores.telefono && <small className="error-texto">{errores.telefono}</small>}
            </div>
          </div>

          {pideEstablecimiento && (
            <div className="campo">
              <label htmlFor="establecimiento">
                Nombre del {ETIQUETAS_TIPO[tipo].toLowerCase()}
              </label>
              <div className={`campo-entrada ${errores.nombreEstablecimiento ? 'con-error' : ''}`}>
                <Store size={18} />
                <input
                  id="establecimiento"
                  type="text"
                  placeholder="Nombre de tu negocio"
                  value={nombreEstablecimiento}
                  onChange={(e) => setNombreEstablecimiento(e.target.value)}
                />
              </div>
              {errores.nombreEstablecimiento && (
                <small className="error-texto">{errores.nombreEstablecimiento}</small>
              )}
            </div>
          )}

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
                placeholder="Mínimo 8 caracteres, con letras y números"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                autoComplete="new-password"
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
            <UserPlus size={18} /> Crear cuenta
          </button>
        </form>

        <p className="auth-pie">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </div>
    </section>
  )
}
