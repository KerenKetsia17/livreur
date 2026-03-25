import { NavLink } from 'react-router-dom'

const tabs = [
  { label: 'Missions', to: '/driver/missions', icon: '📦' },
  { label: 'Notifications', to: '/driver/notifications', icon: '🔔' },
  { label: 'Suivi GPS', to: '/driver/tracking', icon: '🗺️' },
]

export function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Navigation chauffeur">
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.to}
          className={({ isActive }) =>
            isActive ? 'bottom-nav__item bottom-nav__item--active' : 'bottom-nav__item'
          }
        >
          <span className="bottom-nav__icon" aria-hidden>
            {tab.icon}
          </span>
          <span className="bottom-nav__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
