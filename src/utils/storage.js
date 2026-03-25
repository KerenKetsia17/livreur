const STORAGE_KEY = 'camionsuf_user'
const TRACKING_MISSION_KEY = 'camionsuf_tracking_mission'
const DRIVER_NOTIFICATIONS_KEY = 'camionsuf_driver_notifications'

export function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setCurrentUser(user) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEY)
}

export function setCurrentTrackingMission(mission) {
  localStorage.setItem(TRACKING_MISSION_KEY, JSON.stringify(mission))
}

export function getCurrentTrackingMission() {
  const raw = localStorage.getItem(TRACKING_MISSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function clearCurrentTrackingMission() {
  localStorage.removeItem(TRACKING_MISSION_KEY)
}

export function getDriverNotifications() {
  const raw = localStorage.getItem(DRIVER_NOTIFICATIONS_KEY)
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function setDriverNotifications(notifications) {
  const safeNotifications = Array.isArray(notifications) ? notifications : []
  localStorage.setItem(DRIVER_NOTIFICATIONS_KEY, JSON.stringify(safeNotifications))
}

export function addDriverNotification(notification) {
  if (!notification) return
  const list = getDriverNotifications()
  const entry = {
    id: notification.id || `n-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title: notification.title || 'Notification',
    details: notification.details || '',
    time: notification.time || 'a l\'instant',
    unread: notification.unread ?? true,
    createdAt: notification.createdAt || new Date().toISOString(),
  }
  const next = [entry, ...list].slice(0, 30)
  setDriverNotifications(next)
}

export function markDriverNotificationsRead() {
  const list = getDriverNotifications()
  setDriverNotifications(list.map((item) => ({ ...item, unread: false })))
}
