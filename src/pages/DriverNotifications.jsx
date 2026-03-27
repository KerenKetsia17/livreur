import { useMemo, useState } from 'react'
import { BrandHeader } from '../components/BrandHeader'
import {
  getDriverNotifications,
  markDriverNotificationsRead,
  setDriverNotifications,
} from '../utils/storage'

export default function DriverNotifications() {
  const [notifications, setNotifications] = useState(() => getDriverNotifications())
  const unreadCount = useMemo(() => notifications.filter((item) => item.unread).length, [notifications])

  function markAllRead() {
    markDriverNotificationsRead()
    setNotifications(getDriverNotifications())
  }

  function clearAll() {
    setDriverNotifications([])
    setNotifications([])
  }

  return (
    <div className="app driver-dashboard">
      <BrandHeader />
      <main className="page driver-dashboard__page">
        <section className="dashboard-card notifications-page">
          <div className="dashboard-card__header">
            <div>
              <p className="dashboard-card__kicker">Suivi rapide</p>
              <h1>Notifications</h1>
              <p className="notifications-page__subtitle">
                Alertes de missions, etapes de livraison et informations operationnelles.
              </p>
            </div>
            <div className="notifications-page__actions">
              <span className="dashboard-card__status">{unreadCount} non lues</span>
              <button className="button button--outline" onClick={markAllRead}>
                Tout marquer lu
              </button>
              <button className="button button--ghost" onClick={clearAll}>
                Vider
              </button>
            </div>
          </div>

          <div className="notifications__list notifications__list--full">
            {notifications.map((note) => (
              <article key={note.id} className={note.unread ? 'notification notification--unread' : 'notification'}>
                <div className="notification__title">{note.title}</div>
                <div className="notification__details">{note.details}</div>
                <div className="notification__time">Il y a {note.time}</div>
              </article>
            ))}

            {notifications.length === 0 && (
              <div className="empty-state">
                <p>Aucune notification pour le moment.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
