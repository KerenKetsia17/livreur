import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../css/pages/DriverTracking.css'
import { MapRoute } from '../components/MapRoute'
import { getCurrentTrackingMission, clearCurrentTrackingMission } from '../utils/storage'

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
  pickupCoords: { lat: 14.695, lng: -17.444 },
  dropoffCoords: { lat: 14.697, lng: -17.453 },
  waypoints: [
    { lat: 14.7, lng: -17.43, address: 'Étape Intercalaire 1' },
    { lat: 14.696, lng: -17.45, address: 'Étape Intercalaire 2' },
  ],
}

export function DriverTracking() {
  const navigate = useNavigate()
  const [mission, setMission] = useState(() => getCurrentTrackingMission() || fallbackMission)

  useEffect(() => {
    const stored = getCurrentTrackingMission()
    if (stored) setMission(stored)
  }, [])

  const mapPickup = useMemo(
    () => mission?.pickupCoords || { lat: 14.695, lng: -17.444 },
    [mission],
  )

  const mapDropoff = useMemo(
    () => mission?.dropoffCoords || { lat: 14.697, lng: -17.453 },
    [mission],
  )

  const mapWaypoints = useMemo(
    () => mission?.waypoints || [],
    [mission],
  )

  function backToDashboard() {
    navigate('/driver/missions')
  }

  function startMission() {
    setMission((prev) => (prev ? { ...prev, status: 'in_progress' } : prev))
  }

  function completeMission() {
    setMission((prev) => (prev ? { ...prev, status: 'completed' } : prev))
  }

  function resetTracking() {
    clearCurrentTrackingMission()
    navigate('/driver/missions')
  }

  const statusLabel = mission?.status === 'in_progress' ? 'En cours'
    : mission?.status === 'completed' ? 'Terminée'
    : mission?.status === 'assigned' ? 'Assignée'
    : 'En attente'

  return (
    <div className="trk-root">
      {/* Barre supérieure */}
      <header className="trk-topbar">
        <button className="trk-back" onClick={backToDashboard} aria-label="Retour">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="trk-topbar__center">
          <p className="trk-topbar__title">{mission?.title || 'Mission en cours'}</p>
          <p className="trk-topbar__id">{mission?.id}</p>
        </div>
        <span className={`trk-badge trk-badge--${mission?.status || 'unknown'}`}>
          {statusLabel}
        </span>
      </header>

      {/* Carte GPS — plein écran */}
      <div className="trk-map">
        <MapRoute pickup={mapPickup} dropoff={mapDropoff} waypoints={mapWaypoints} />
        <div className="trk-map__live">
          <span className="trk-live-dot" />
          <span>GPS actif</span>
        </div>
      </div>

      {/* Panneau infos bas */}
      <div className="trk-panel">
        {/* Itinéraire */}
        <div className="trk-route">
          <div className="trk-route__point">
            <span className="trk-route__marker trk-route__marker--a">A</span>
            <div className="trk-route__text">
              <span className="trk-route__label">Chargement</span>
              <p className="trk-route__addr">{mission?.pickup}</p>
            </div>
          </div>
          <div className="trk-route__line" />
          <div className="trk-route__point">
            <span className="trk-route__marker trk-route__marker--b">B</span>
            <div className="trk-route__text">
              <span className="trk-route__label">Livraison</span>
              <p className="trk-route__addr">{mission?.dropoff}</p>
            </div>
          </div>
        </div>

        {/* Métriques */}
        <div className="trk-metrics">
          <div className="trk-metric">
            <strong>{mission?.distance || 0} km</strong>
            <span>Distance</span>
          </div>
          <div className="trk-metric trk-metric--sep" />
          <div className="trk-metric">
            <strong>{mission?.duration || 0} min</strong>
            <span>Durée estimée</span>
          </div>
          <div className="trk-metric trk-metric--sep" />
          <div className="trk-metric">
            <strong>{mission?.price?.toLocaleString('fr-FR') || 0} F</strong>
            <span>Rémunération</span>
          </div>
        </div>

        {/* Client */}
        <div className="trk-customer">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>{mission?.customer}</span>
          {mission?.phone && (
            <a href={`tel:${mission.phone}`} className="trk-customer__phone">
              {mission.phone}
            </a>
          )}
        </div>

        {/* Actions */}
        <div className="trk-actions">
          <button
            className="trk-btn trk-btn--primary"
            onClick={() => {
              if (mission?.status === 'in_progress') completeMission()
              else if (mission?.status === 'completed') resetTracking()
              else startMission()
            }}
          >
            {mission?.status === 'in_progress' ? 'Confirmer la livraison'
              : mission?.status === 'completed' ? 'Terminer et quitter'
              : 'Démarrer la mission'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DriverTracking
