import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { MapRoute } from '../components/MapRoute'
import { BottomNav } from '../components/BottomNav'
import { getCurrentTrackingMission, clearCurrentTrackingMission } from '../utils/storage'
import '../css/pages/DriverTracking.css'

const fallbackMission = {
  id: 'CMD-2024-0031',
  status: 'in_progress',
  title: '8 m³ de Sable',
  price: 45000,
  pickup: 'Carrière de Mbao, Dakar',
  dropoff: 'Chantier Sicap Liberté 5, Dakar',
  distance: 18.4,
  duration: 32,
  customer: 'Ibrahim Sow',
  phone: '+221 76 543 21 09',
  volumeLabel: '8 m³',
  pickupCoords:  { lat: 14.695, lng: -17.444 },
  dropoffCoords: { lat: 14.697, lng: -17.453 },
}

export function DriverTracking() {
  const navigate = useNavigate()
  const [mission, setMission] = useState(() => getCurrentTrackingMission() || fallbackMission)
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    const stored = getCurrentTrackingMission()
    if (stored) setMission(stored)
  }, [])

  const mapPickup  = useMemo(() => mission?.pickupCoords  || { lat: 14.695, lng: -17.444 }, [mission])
  const mapDropoff = useMemo(() => mission?.dropoffCoords || { lat: 14.697, lng: -17.453 }, [mission])

  async function handleComplete() {
    if (!mission?.id) return
    setActionLoading(true)
    try {
      await setDoc(doc(db, 'orders', mission.id),
        { status: 'completed', deliveredAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
        { merge: true })
      setMission(prev => ({ ...prev, status: 'completed' }))
    } catch (e) {
      console.error(e)
    } finally {
      setActionLoading(false)
    }
  }

  function handleBack() {
    navigate('/driver')
  }

  function handleQuit() {
    clearCurrentTrackingMission()
    navigate('/driver')
  }

  const statusLabel = {
    in_progress: 'En cours',
    assigned:    'Assignée',
    completed:   'Livrée',
    delivered:   'Livrée',
  }[mission?.status] || 'En cours'

  const statusColor = {
    in_progress: '#1d68d4',
    assigned:    '#f97316',
    completed:   '#16a34a',
    delivered:   '#16a34a',
  }[mission?.status] || '#1d68d4'

  return (
    <>
    <div className="trk-root">

      {/* ── Carte (zone principale) ── */}
      <div className="trk-map">
        <MapRoute pickup={mapPickup} dropoff={mapDropoff} />
        <div className="trk-map__live">
          <span className="trk-live-dot"></span>
          Live
        </div>
      </div>

      {/* ── Panneau infos ── */}
      <div className="trk-panel">

        {/* En-tête panneau */}
        <div className="trk-panel__header">
          <button className="trk-back" onClick={handleBack} aria-label="Retour">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="trk-panel__title-block">
            <h1 className="trk-panel__title">Suivi de livraison</h1>
            <p className="trk-panel__sub">{mission?.title || 'Mission en cours'}</p>
          </div>
          <span className="trk-badge" style={{ color: statusColor, background: statusColor + '18' }}>
            {statusLabel}
          </span>
        </div>

        {/* Itinéraire */}
        <div className="trk-route">
          <div className="trk-route__point">
            <div className="trk-route__marker trk-route__marker--a">
              <svg width="10" height="10" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" fill="white"/>
              </svg>
            </div>
            <div className="trk-route__text">
              <span className="trk-route__label">Depuis</span>
              <p className="trk-route__addr">{mission?.pickup}</p>
            </div>
          </div>
          <div className="trk-route__line"></div>
          <div className="trk-route__point">
            <div className="trk-route__marker trk-route__marker--b">
              <svg width="10" height="10" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" fill="white"/>
              </svg>
            </div>
            <div className="trk-route__text">
              <span className="trk-route__label">Livraison</span>
              <p className="trk-route__addr">{mission?.dropoff}</p>
            </div>
          </div>
        </div>

        <div className="trk-sep"></div>

        {/* Métriques */}
        <div className="trk-metrics">
          {mission?.distance && (
            <div className="trk-metric">
              <div className="trk-metric__icon trk-metric__icon--blue">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <strong>{mission.distance} km</strong>
              <span>Distance</span>
            </div>
          )}
          {mission?.duration && (
            <div className="trk-metric">
              <div className="trk-metric__icon trk-metric__icon--dark">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <strong>{mission.duration} min</strong>
              <span>Durée</span>
            </div>
          )}
          <div className="trk-metric">
            <div className="trk-metric__icon trk-metric__icon--green">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 7v2m0 6v2m-3-5h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <strong>{mission?.price?.toLocaleString('fr-FR')}</strong>
            <span>FCFA</span>
          </div>
        </div>

        <div className="trk-sep"></div>

        {/* Client */}
        <div className="trk-customer">
          <div className="trk-customer__avatar">
            {(mission?.customer || 'C').charAt(0).toUpperCase()}
          </div>
          <div className="trk-customer__info">
            <span className="trk-customer__name">{mission?.customer}</span>
            <span className="trk-customer__sub">Client</span>
          </div>
          {mission?.phone && (
            <a href={`tel:${mission.phone}`} className="trk-call-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.8 10.81a19.79 19.79 0 01-3.07-8.67A2 2 0 012.71 0h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L6.82 7.22a16 16 0 006 6l.61-1.44a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 14v2.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Appeler
            </a>
          )}
        </div>

        {/* Note instructions */}
        <div className="trk-note">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {mission?.note || 'Aucune instruction particulière du client.'}
        </div>

        {/* Bouton CTA */}
        <div className="trk-actions">
          {(mission?.status === 'in_progress' || mission?.status === 'assigned') && (
            <button className="trk-btn trk-btn--primary" onClick={handleComplete} disabled={actionLoading}>
              {actionLoading ? (
                <span className="trk-spinner"></span>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 8h4l3 4v4h-7V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2"/>
                </svg>
              )}
              {actionLoading ? 'Enregistrement…' : 'Confirmer la livraison'}
            </button>
          )}

          {(mission?.status === 'completed' || mission?.status === 'delivered') && (
            <div className="trk-done">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Livraison confirmée !
            </div>
          )}

          <button className="trk-btn trk-btn--ghost" onClick={handleQuit}>
            Quitter
          </button>
        </div>

      </div>

    </div>
    <BottomNav />
    </>
  )
}

export default DriverTracking
