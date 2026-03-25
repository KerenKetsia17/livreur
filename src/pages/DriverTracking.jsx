import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandHeader } from '../components/BrandHeader'
import { BottomNav } from '../components/BottomNav'
import '../App.css'
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

  return (
    <div className="app driver-dashboard">
      <BrandHeader />
      <main className="page driver-dashboard__page tracking-page">
        {/* En-tête très léger au-dessus du layout deux colonnes */}
        <section className="tracking-header-card">
          <div className="tracking-header-main">
            <p className="tracking-kicker">Suivi GPS</p>
          </div>
        </section>

        {/* Layout deux colonnes : panneau à gauche, carte à droite */}
        <div className="tracking-main-grid">
          {/* Panneau gauche : infos trajet + actions */}
          <section className="tracking-summary-card">
            <div className="tracking-mission-header">
              <div>
                <h2 className="tracking-mission-title">{mission?.title || 'Commande en cours'}</h2>
                <p className="tracking-mission-meta">
                  Bus / Camion : {mission?.id || 'N/A'} • Client : {mission?.customer || '-'}
                </p>
              </div>
              <div className="tracking-mission-aside">
                <span className="tracking-tag">{mission?.volumeLabel || 'Chargement'}</span>
                <span className={`status-pill status-pill--${mission?.status || 'unknown'}`}>
                  {mission?.status || 'inconnue'}
                </span>
              </div>
            </div>

            <div className="tracking-summary-main">
              <div className="tracking-summary-row">
                <div>
                  <span className="tracking-label">Récupération</span>
                  <p className="tracking-value">{mission?.pickup}</p>
                </div>
                <div>
                  <span className="tracking-label">Livraison</span>
                  <p className="tracking-value">{mission?.dropoff}</p>
                </div>
              </div>
              <div className="tracking-summary-row tracking-summary-row--metrics">
                <div>
                  <span className="tracking-label">Distance</span>
                  <p className="tracking-value">{mission?.distance || 0} km</p>
                </div>
                <div>
                  <span className="tracking-label">Durée estimée</span>
                  <p className="tracking-value">{mission?.duration || 0} min</p>
                </div>
                <div>
                  <span className="tracking-label">Gain</span>
                  <p className="tracking-value">{mission?.price || 0} FCFA</p>
                </div>
              </div>
            </div>

            <div className="tracking-actions">
              <button className="button button--ghost button--large" onClick={backToDashboard}>
                Retour missions
              </button>

              <button
                className="button button--primary button--large"
                onClick={() => {
                  if (mission?.status === 'in_progress') {
                    completeMission()
                  } else if (mission?.status === 'completed') {
                    resetTracking()
                  } else {
                    startMission()
                  }
                }}
              >
                {mission?.status === 'in_progress'
                  ? 'Confirmer livraison'
                  : mission?.status === 'completed'
                  ? 'Terminer & quitter'
                  : 'Démarrer la mission'}
              </button>
            </div>
          </section>

          {/* Colonne droite : carte */}
          <section className="tracking-map-card">
            <header className="tracking-map-card__header">
              <div>
                <p className="tracking-map-title">Position en temps réel</p>
                <p className="tracking-map-sub">{mission?.pickup} ➜ {mission?.dropoff}</p>
              </div>
            </header>

            <div className="tracking-map-wrapper">
              <MapRoute pickup={mapPickup} dropoff={mapDropoff} waypoints={mapWaypoints} />
            </div>
          </section>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

export default DriverTracking
