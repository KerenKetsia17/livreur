import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'
import { api, handleApiError } from '../api/client'
import { setCurrentUser } from '../utils/storage'
import logoImg from '../assets/logoimg.png'
import backgroundImage from '../assets/pexels-rezwan-1116035.jpg'

const roles = [
  { value: 'driver', label: 'Livreur' },
]

export function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const [error, setError] = useState(null)

  async function handleSubmit(event) {
    event.preventDefault()

    if (!email.trim() || !password) {
      setError('Veuillez saisir un email et un mot de passe.')
      return
    }

    const authEmail = email.trim().toLowerCase()

    try {
      try {
        await signInWithEmailAndPassword(auth, authEmail, password)
      } catch (innerErr) {
        if (innerErr.code === 'auth/user-not-found') {
          await createUserWithEmailAndPassword(auth, authEmail, password)
          await signInWithEmailAndPassword(auth, authEmail, password)
        } else {
          throw innerErr
        }
      }

      const user = {
        id: auth.currentUser.uid,
        name: name.trim() || authEmail.split('@')[0] || 'Livreur',
        role: 'driver',
      }
      setCurrentUser(user)
      setError(null)

      await api.post('/api/drivers', {
        id: user.id,
        name: user.name,
        email: authEmail,
        role: 'driver',
      })
      navigate('/driver')
    } catch (err) {
      setError(handleApiError(err).message)
    }
  }

  return (
    <div
      className="page page--centered"
      style={{
        backgroundImage: `linear-gradient(160deg, rgba(5, 17, 37, 0.86), rgba(5, 17, 37, 0.86)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="card card--wide">
        <div className="login__brand">
          <img src={logoImg} alt="CamionSuf" className="login__logo" />
          <div>
            <h1>CamionSuf</h1>
            <p className="login__subtitle">Sable et béton en un clic</p>
          </div>
        </div>
        <form className="login__form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Nom</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom" />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
          </label>
          <label className="field">
            <span>Mot de passe</span>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" />
          </label>
          {error && <div className="alert alert--danger">{error}</div>}
          <button type="submit" className="button button--primary button--full">
            Se connecter / s'inscrire
          </button>
        </form>
      </div>
    </div>
  )
}
