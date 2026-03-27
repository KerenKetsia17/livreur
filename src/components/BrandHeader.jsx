import { Link, useLocation } from 'react-router-dom'
import logoImg from '../assets/logoimg.png'
import { getDriverNotifications, getCurrentUser } from '../utils/storage'
import { auth } from '../firebase'

const navItems = [
  { to: '/driver/missions', label: 'Missions' },
  { to: '/driver/tracking', label: 'Suivi GPS' },
]

export function BrandHeader() {
  const location = useLocation()
  const unreadCount = getDriverNotifications().filter((item) => item.unread).length

  const storedUser = getCurrentUser()
  const firebaseUser = auth.currentUser
  const displayName =
    firebaseUser?.displayName ||
    firebaseUser?.email?.split('@')[0] ||
    storedUser?.name ||
    'Chauffeur'
  const initial = displayName[0]?.toUpperCase() ?? '?'

  return (
    <header className="topbar">
      <div className="topbar__brand">
        <img src={logoImg} alt="CamionSuf" className="topbar__logo" />
        <div className="topbar__title">
          <span className="topbar__name">CamionSuf</span>
          <span className="topbar__tagline">Sable et béton en un clic</span>
        </div>
      </div>
      <nav className="topbar__nav">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.to)
          const className = active ? 'topbar__navItem topbar__navItem--active' : 'topbar__navItem'
          return (
            <Link key={item.to} to={item.to} className={className}>
              {item.label}
            </Link>
          )
        })}
      </nav>
      <div className="topbar__actions">
        <Link
          to="/driver/notifications"
          className={location.pathname.startsWith('/driver/notifications') ? 'topbar__actionButton topbar__actionButton--active' : 'topbar__actionButton'}
          aria-label="Notifications"
        >
          <span className="topbar__actionIcon" aria-hidden>🔔</span>
          {unreadCount > 0 && <span className="topbar__badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
        </Link>
        <div className="topbar__user">
          <div className="topbar__avatar">{initial}</div>
          <span className="topbar__username">{displayName}</span>
        </div>
      </div>
    </header>
  )
}
