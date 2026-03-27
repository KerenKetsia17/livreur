import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { setCurrentTrackingMission, addDriverNotification } from '../utils/storage'
import '../css/pages/MissionDetail.css'

const DELIVERY_MODES = [
  { key: 'express',     label: 'Livraison Express', icon: '⚡', description: 'Livraison en 30 minutes', color: '#f97316', surcharge: 2000 },
  { key: 'prioritaire', label: 'Prioritaire',       icon: '🚀', description: 'Livraison à heure précise', color: '#ef4444', surcharge: 3500 },
  { key: 'standard',   label: 'Standard',           icon: '📦', description: 'Livraison en 2 à 4 heures', color: '#1d68d4', surcharge: 0 },
]

function detectDeliveryMode(mission) {
  const t = (mission.deliveryType || mission.type || '').toLowerCase()
  if (t.includes('express') || mission.duration <= 30) return 'express'
  if (t.includes('prioritaire') || t.includes('priority')) return 'prioritaire'
  return 'standard'
}

const STATUS_CFG = {
  assigned:   { label: 'Assignée',  color: '#f97316', bg: '#fff7ed' },
  in_progress:{ label: 'En cours',  color: '#1d68d4', bg: '#eff6ff' },
  completed:  { label: 'Livrée',    color: '#16a34a', bg: '#dcfce7' },
  delivered:  { label: 'Livrée',    color: '#16a34a', bg: '#dcfce7' },
}

export function MissionDetail({ mission, onClose }) {
  const navigate = useNavigate()
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    function handleKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const currentMode = useMemo(() => {
    if (!mission) return DELIVERY_MODES[2]
    return DELIVERY_MODES.find(m => m.key === detectDeliveryMode(mission)) || DELIVERY_MODES[2]
  }, [mission])

  const statusCfg = STATUS_CFG[mission.status] || STATUS_CFG.assigned

  const material = useMemo(() => {
    if (!mission) return '—'
    const words = mission.title.split(' ')
    return words.filter(w => !/^\d/.test(w) && !/m[³3]/i.test(w)).join(' ').trim() || mission.title
  }, [mission])

  const volume = (mission?.volumeLabel || '').replace(/m3/i, 'm³')
  const totalPrice = (mission.price || 0) + currentMode.surcharge

  async function handleAccept() {
    setActionLoading(true)
    try {
      await setDoc(doc(db, 'orders', mission.id),
        { status: 'in_progress', updatedAt: new Date().toISOString() },
        { merge: true })
      setCurrentTrackingMission({ ...mission, status: 'in_progress' })
      addDriverNotification({
        title: 'Mission démarrée',
        details: `${mission.title} — ${mission.dropoff}`,
        unread: true,
        time: "à l'instant",
        createdAt: new Date().toISOString(),
      })
      navigate('/driver/tracking')
    } catch (err) {
      setError(err.message)
      setActionLoading(false)
    }
  }

  async function handleComplete() {
    setActionLoading(true)
    try {
      await setDoc(doc(db, 'orders', mission.id),
        { status: 'completed', deliveredAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { merge: true })
      setCurrentTrackingMission({ ...mission, status: 'completed' })
      navigate('/driver/tracking')
    } catch (err) {
      setError(err.message)
      setActionLoading(false)
    }
  }

  return (
    <div className="md-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="md-dialog" onClick={e => e.stopPropagation()}>

        {/* ── Header ── */}
        <div className="md-header">
          <div className="md-header__left">
            <span className="md-header__label">Mission en cours</span>
            <span className="md-status-badge" style={{ color: statusCfg.color, background: statusCfg.bg }}>
              {statusCfg.label}
            </span>
          </div>
          <button className="md-close-btn" onClick={onClose} aria-label="Fermer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* ── Body ── */}
        <div className="md-body">

          {error && <div className="md-error-msg">Une erreur est survenue. Veuillez réessayer.</div>}

          {/* Carte mission principale */}
          <div className="md-mission-card">

            {/* Itinéraire */}
            <div className="md-itinerary">
              <div className="md-stop">
                <div className="md-pin md-pin--orange">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="md-stop__text">
                  <span className="md-stop__main">{volume ? `${volume} ${material}` : material}</span>
                  <span className="md-stop__sub">Chargement</span>
                </div>
              </div>

              <div className="md-itinerary__separator">
                <div className="md-itinerary__dots"></div>
              </div>

              <div className="md-stop">
                <div className="md-pin md-pin--blue">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                  </svg>
                </div>
                <div className="md-stop__text">
                  <span className="md-stop__main">{mission.dropoff}</span>
                  <span className="md-stop__sub">Livraison</span>
                </div>
              </div>
            </div>

            {/* Séparateur tirets style ticket */}
            <div className="md-ticket-sep"></div>

            {/* Quick infos */}
            <div className="md-quick-infos">
              {mission.distance && (
                <div className="md-quick-item">
                  <div className="md-quick-icon md-quick-icon--blue">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span className="md-quick-value">{mission.distance}</span>
                  <span className="md-quick-label">km</span>
                </div>
              )}
              {mission.duration && (
                <div className="md-quick-item">
                  <div className="md-quick-icon md-quick-icon--navy">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span className="md-quick-value">{mission.duration}</span>
                  <span className="md-quick-label">min</span>
                </div>
              )}
              <div className="md-quick-item">
                <div className="md-quick-icon md-quick-icon--green">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 6v2m0 8v2m-4-6h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </div>
                <span className="md-quick-value">{totalPrice.toLocaleString('fr-FR')}</span>
                <span className="md-quick-label">FCFA</span>
              </div>
              <div className="md-quick-item">
                <div className="md-quick-icon md-quick-icon--orange">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="md-quick-label">{currentMode.label}</span>
              </div>
            </div>
          </div>

          {/* Client */}
          <div className="md-client-card">
            <div className="md-client-avatar">
              {(mission.customer || 'C').charAt(0).toUpperCase()}
            </div>
            <div className="md-client-info">
              <span className="md-client-name">{mission.customer}</span>
              <span className="md-client-sub">Client</span>
            </div>
            {mission.phone && (
              <a href={`tel:${mission.phone}`} className="md-call-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.8 10.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.71 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.82 7.22a16 16 0 006 6l.61-1.44a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Appeler
              </a>
            )}
          </div>

          {/* Point de départ */}
          <div className="md-pickup-info">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#1d68d4">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            <span className="md-pickup-label">Départ :</span>
            <span className="md-pickup-address">{mission.pickup}</span>
          </div>

        </div>

        {/* ── Footer ── */}
        <div className="md-footer">
          {mission.status === 'assigned' && (
            <div className="md-action-row">
              <button className="md-btn md-btn--accept" onClick={handleAccept} disabled={actionLoading}>
                {actionLoading ? <span className="md-btn-spinner"></span> : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {actionLoading ? 'Démarrage…' : 'Accepter'}
              </button>
              <button className="md-btn md-btn--refuse" onClick={onClose}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                </svg>
                Refuser
              </button>
            </div>
          )}

          {mission.status === 'in_progress' && (
            <button className="md-btn md-btn--track" onClick={handleComplete} disabled={actionLoading}>
              {actionLoading ? <span className="md-btn-spinner"></span> : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 8h4l3 4v4h-7V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
              {actionLoading ? 'Enregistrement…' : 'Suivre la livraison'}
            </button>
          )}

          {(mission.status === 'completed' || mission.status === 'delivered') && (
            <div className="md-done-banner">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Colis livré avec succès !
            </div>
          )}
        </div>

      </div>
    </div>
  )
}