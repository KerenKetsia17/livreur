import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { BrandHeader } from '../components/BrandHeader'
import '../App.css'
import { BottomNav } from '../components/BottomNav'
import { getCurrentPosition } from '../utils/geo'
import {
  addDriverNotification,
  getCurrentUser,
  getDriverNotifications,
  setCurrentTrackingMission,
  setDriverNotifications,
} from '../utils/storage'
import { useOrders } from '../hooks/useOrders'
import { db } from '../firebase'

const tabOptions = [
  { key: 'all', label: 'Toutes' },
  { key: 'in_progress', label: 'En cours' },
  { key: 'assigned', label: 'Assignees' },
  { key: 'delivered', label: 'Livrees' },
]

const defaultNotifications = [
  {
    id: 'n-seed-1',
    title: 'Brief de tournee',
    details: 'Votre planning est pret. Consultez vos missions assignees.',
    time: '1 h',
    unread: false,
    createdAt: new Date().toISOString(),
  },
]

const sampleMissions = [
  {
    id: 'CMD-2024-0031',
    status: 'in_progress',
    title: '8 m3 de Sable',
    volumeLabel: '8 m3',
    price: 45000,
    pickup: 'Carriere de Mbao, Dakar',
    dropoff: 'Chantier Sicap Liberte 5, Dakar',
    distance: 18.4,
    duration: 32,
    customer: 'Ibrahim Sow',
    phone: '+221 76 543 21 09',
    pickupCoords: { lat: 14.695, lng: -17.444 },
    dropoffCoords: { lat: 14.697, lng: -17.453 },
    waypoints: [
      { lat: 14.7, lng: -17.43, address: 'Etape Intercalaire 1' },
      { lat: 14.696, lng: -17.45, address: 'Etape Intercalaire 2' },
    ],
  },
  {
    id: 'CMD-2024-0032',
    status: 'assigned',
    title: '6 m3 de Beton',
    volumeLabel: '6 m3',
    price: 38000,
    pickup: 'Centrale a beton Pikine, Dakar',
    dropoff: 'Residence Fann Hock, Dakar',
    distance: 12.7,
    duration: 24,
    customer: 'Fatou Ndiaye',
    phone: '+221 77 123 45 67',
    pickupCoords: { lat: 14.744, lng: -17.39 },
    dropoffCoords: { lat: 14.689, lng: -17.468 },
    waypoints: [
      { lat: 14.725, lng: -17.41, address: 'Etape Intercalaire 1' },
      { lat: 14.705, lng: -17.435, address: 'Etape Intercalaire 2' },
    ],
  },
  {
    id: 'CMD-2024-0030',
    status: 'delivered',
    title: '10 m3 de Gravier',
    volumeLabel: '10 m3',
    price: 52000,
    pickup: 'Carriere Thiaroye, Dakar',
    dropoff: 'Grand Yoff Extension, Dakar',
    distance: 9.2,
    duration: 18,
    customer: 'Cheikh Mbaye',
    phone: '+221 78 987 65 43',
    pickupCoords: { lat: 14.76, lng: -17.33 },
    dropoffCoords: { lat: 14.74, lng: -17.46 },
    waypoints: [
      { lat: 14.75, lng: -17.39, address: 'Etape Intercalaire 1' },
    ],
  },
]

export function DriverDashboard() {
  const navigate = useNavigate()
  const user = getCurrentUser()
  const { orders: missions, loading, error: ordersError } = useOrders({ driverId: user?.id })

  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [selectedMission, setSelectedMission] = useState(null)
  const [incomingMission, setIncomingMission] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const knownMissionIdsRef = useRef(new Set())

  const missionPool = useMemo(() => {
    if (!missions?.length) return sampleMissions

    return missions.map((mission) => {
      const status = mission.status === 'pending' ? 'assigned' : mission.status
      const title = mission.title || mission.product || mission.material || 'Commande sans titre'
      const volumeLabel = mission.volumeLabel || mission.volume || title.match(/\d+\s?m3/i)?.[0] || 'N/A'
      return {
        id: mission.id,
        status: status || 'assigned',
        title,
        volumeLabel,
        price: Number(mission.price ?? mission.amount ?? 0),
        pickup: mission.pickup || mission.pickupAddress || 'Point de chargement non renseigne',
        dropoff: mission.dropoff || mission.deliveryAddress || 'Point de livraison non renseigne',
        distance: Number(mission.distance ?? 0),
        duration: Number(mission.duration ?? 0),
        customer: mission.customer || mission.customerName || 'Client',
        phone: mission.phone || mission.customerPhone || '-',
        pickupCoords: mission.pickupCoords,
        dropoffCoords: mission.dropoffCoords,
        waypoints: mission.waypoints || [],
      }
    })
  }, [missions])

  const filteredMissions = useMemo(() => {
    if (activeTab === 'all') return missionPool
    if (activeTab === 'in_progress') return missionPool.filter((m) => m.status === 'in_progress')
    if (activeTab === 'assigned') return missionPool.filter((m) => m.status === 'assigned')
    if (activeTab === 'delivered') return missionPool.filter((m) => m.status === 'delivered' || m.status === 'completed')
    return missionPool
  }, [activeTab, missionPool])

  const stats = useMemo(() => {
    const inProgress = missionPool.filter((mission) => mission.status === 'in_progress').length
    const delivered = missionPool.filter((mission) => mission.status === 'delivered' || mission.status === 'completed').length
    const assigned = missionPool.filter((mission) => mission.status === 'assigned').length
    const todayRevenue = missionPool
      .filter((mission) => mission.status === 'delivered' || mission.status === 'completed')
      .reduce((acc, mission) => acc + (Number(mission.price) || 0), 0)

    return {
      total: missionPool.length,
      inProgress,
      assigned,
      delivered,
      todayRevenue,
    }
  }, [missionPool])

  function pushNotification(title, details) {
    addDriverNotification({
      title,
      details,
      unread: true,
      time: 'a l\'instant',
      createdAt: new Date().toISOString(),
    })
  }

  useEffect(() => {
    if (getDriverNotifications().length === 0) {
      setDriverNotifications(defaultNotifications)
    }
  }, [])

  useEffect(() => {
    setError(ordersError)
  }, [ordersError])

  useEffect(() => {
    getCurrentPosition()
      .then((coords) => {
        const userId = user?.id || 'unknown'
        return setDoc(
          doc(db, 'drivers', userId),
          {
            location: coords,
            updatedAt: new Date().toISOString(),
          },
          { merge: true },
        )
      })
      .catch(() => null)

    const watcher = navigator.geolocation?.watchPosition(
      async (position) => {
        try {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          }
          const userId = user?.id || 'unknown'
          await setDoc(
            doc(db, 'drivers', userId),
            {
              location: coords,
              updatedAt: new Date().toISOString(),
            },
            { merge: true },
          )
        } catch {
          // ignore realtime location update errors
        }
      },
      () => null,
      { enableHighAccuracy: true, maximumAge: 20000, distanceFilter: 10 },
    )

    return () => {
      if (watcher && navigator.geolocation && navigator.geolocation.clearWatch) {
        navigator.geolocation.clearWatch(watcher)
      }
    }
  }, [user?.id])

  useEffect(() => {
    if (!missionPool.length) return

    const knownIds = knownMissionIdsRef.current
    if (knownIds.size === 0) {
      missionPool.forEach((mission) => knownIds.add(mission.id))
      return
    }

    const freshMission = missionPool.find((mission) => !knownIds.has(mission.id))
    if (freshMission) {
      setIncomingMission(freshMission)
      pushNotification(
        'Nouvelle mission recue',
        `${freshMission.title} - ${freshMission.pickup} -> ${freshMission.dropoff}`,
      )
    }

    missionPool.forEach((mission) => knownIds.add(mission.id))
  }, [missionPool])

  async function updateMissionStatus(mission, status) {
    try {
      await setDoc(
        doc(db, 'orders', mission.id),
        {
          status,
          ...(status === 'completed' && { deliveredAt: new Date().toISOString() }),
          updatedAt: new Date().toISOString(),
        },
        { merge: true },
      )

      setSelectedMission((prev) => (prev ? { ...prev, status } : prev))

      if (status === 'in_progress') {
        pushNotification('Mission demarree', `La mission ${mission.id} est maintenant en cours.`)
      }

      if (status === 'completed') {
        const completedMission = { ...mission, status: 'completed' }
        pushNotification('Livraison confirmee', `Mission ${mission.id} livree. Ouverture du suivi GPS.`)
        setCurrentTrackingMission(completedMission)
        navigate('/driver/tracking')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  function openTrackingPage() {
    if (!selectedMission) return
    setCurrentTrackingMission(selectedMission)
    navigate('/driver/tracking')
  }

  function acceptIncomingMission() {
    if (!incomingMission) return
    setSelectedMission(incomingMission)
    setActiveTab('assigned')
    setIncomingMission(null)
    pushNotification('Mission acceptee', `Vous avez accepte ${incomingMission.id}.`)
  }

  function dismissIncomingMission() {
    if (!incomingMission) return
    pushNotification('Mission ignoree', `Vous avez ignore ${incomingMission.id}.`)
    setIncomingMission(null)
  }

  function openModal(mission) {
    setSelectedMission(mission)
    setModalOpen(true)
  }

  function closeModal() {
    setModalOpen(false)
  }

  function getStatusLabel(status) {
    const labels = {
      assigned: 'Assignée',
      in_progress: 'En cours',
      delivered: 'Livrée',
      completed: 'Terminée',
    }
    return labels[status] || status
  }

  function downloadTicket() {
    if (!selectedMission || (selectedMission.status !== 'completed' && selectedMission.status !== 'delivered')) return

    const content = [
      'CAMIONSUF - E-TICKET',
      `Mission: ${selectedMission.id}`,
      `Client: ${selectedMission.customer}`,
      `Statut: ${selectedMission.status}`,
      `Gain: ${selectedMission.price} FCFA`,
      `Date: ${new Date().toLocaleString('fr-FR')}`,
    ].join('\n')

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `eticket-${selectedMission.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="app driver-dashboard">
      <BrandHeader />
      <main className="page driver-dashboard__page">
        <section className="driver-layout">
          {/* ══ WELCOME & STATS HEADER ══ */}
          <div className="dashboard-welcome">
            <div className="dashboard-welcome__content">
              <div className="dashboard-welcome__greeting">
                <span className="dashboard-welcome__icon">👋</span>
                <div>
                  <h1>Bonjour, {user?.name || 'Chauffeur'}</h1>
                  <p>Voici vos missions du jour</p>
                </div>
              </div>
              <div className="dashboard-welcome__status">
                <div className="status-badge status-badge--active">
                  <span className="status-badge__dot"></span>
                  <span className="status-badge__label">En service</span>
                </div>
              </div>
            </div>
          </div>

          {/* ══ STATS GRID ══ */}
          <div className="dashboard-stats">
            <article className="dashboard-stat-card dashboard-stat-card--primary">
              <div className="dashboard-stat-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="dashboard-stat-card__content">
                <span className="dashboard-stat-card__label">Total missions</span>
                <strong className="dashboard-stat-card__value">{stats.total}</strong>
              </div>
            </article>

            <article className="dashboard-stat-card dashboard-stat-card--warning">
              <div className="dashboard-stat-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="dashboard-stat-card__content">
                <span className="dashboard-stat-card__label">En cours</span>
                <strong className="dashboard-stat-card__value">{stats.inProgress}</strong>
              </div>
            </article>

            <article className="dashboard-stat-card dashboard-stat-card--info">
              <div className="dashboard-stat-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 8v6M23 11h-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="dashboard-stat-card__content">
                <span className="dashboard-stat-card__label">Assignées</span>
                <strong className="dashboard-stat-card__value">{stats.assigned}</strong>
              </div>
            </article>

            <article className="dashboard-stat-card dashboard-stat-card--success">
              <div className="dashboard-stat-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="dashboard-stat-card__content">
                <span className="dashboard-stat-card__label">Livrées</span>
                <strong className="dashboard-stat-card__value">{stats.delivered}</strong>
              </div>
            </article>

            <article className="dashboard-stat-card dashboard-stat-card--accent">
              <div className="dashboard-stat-card__icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="dashboard-stat-card__content">
                <span className="dashboard-stat-card__label">CA du jour</span>
                <strong className="dashboard-stat-card__value">{stats.todayRevenue.toLocaleString('fr-FR')} F</strong>
              </div>
            </article>
          </div>

          {/* ══ INCOMING MISSION ALERT ══ */}
          {incomingMission && (
            <section className="incoming-mission-alert" role="status" aria-live="polite">
              <div className="incoming-mission-alert__header">
                <div className="incoming-mission-alert__badge">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Nouvelle mission</span>
                </div>
                <span className="incoming-mission-alert__id">{incomingMission.id}</span>
              </div>

              <div className="incoming-mission-alert__content">
                <h3 className="incoming-mission-alert__title">{incomingMission.title}</h3>
                
                <div className="incoming-mission-alert__route">
                  <div className="route-point route-point--pickup">
                    <span className="route-point__icon">📍</span>
                    <div className="route-point__info">
                      <span className="route-point__label">Départ</span>
                      <p className="route-point__address">{incomingMission.pickup}</p>
                    </div>
                  </div>
                  <div className="route-connector"></div>
                  <div className="route-point route-point--dropoff">
                    <span className="route-point__icon">🎯</span>
                    <div className="route-point__info">
                      <span className="route-point__label">Arrivée</span>
                      <p className="route-point__address">{incomingMission.dropoff}</p>
                    </div>
                  </div>
                </div>

                <div className="incoming-mission-alert__meta">
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    <span>{incomingMission.volumeLabel}</span>
                  </div>
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 6.9 8 11.7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{incomingMission.distance} km</span>
                  </div>
                  <div className="meta-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>{incomingMission.duration} min</span>
                  </div>
                  <div className="meta-item meta-item--price">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <strong>{incomingMission.price.toLocaleString('fr-FR')} FCFA</strong>
                  </div>
                </div>
              </div>

              <div className="incoming-mission-alert__actions">
                <button className="button button--primary button--large" onClick={acceptIncomingMission}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Accepter la mission
                </button>
                <button className="button button--ghost" onClick={dismissIncomingMission}>
                  Ignorer
                </button>
              </div>
            </section>
          )}

          {/* ══ MISSIONS HUB ══ */}
          <section className="missions-hub">
            <header className="missions-hub__header">
              <div className="missions-hub__title">
                <span className="missions-hub__kicker">Planification</span>
                <h2>Ordonnancement des missions</h2>
              </div>
              <div className="missions-hub__filters">
                {tabOptions.map((tab) => {
                  const isActive = activeTab === tab.key
                  return (
                    <button
                      key={tab.key}
                      className={`missions-filter-tab ${isActive ? 'missions-filter-tab--active' : ''}`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  )
                })}
              </div>
            </header>

            <div className="missions-hub__layout">
              <div className="missions-list">
                <div className="missions-list__header">
                  <h3>{filteredMissions.length} mission{filteredMissions.length !== 1 ? 's' : ''}</h3>
                  {loading && <span className="loading-indicator">Actualisation…</span>}
                </div>

                <div className="missions-list__content">
                  {filteredMissions.length === 0 ? (
                    <div className="empty-state">
                      <svg width="56" height="56" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                      <h4>Aucune mission</h4>
                      <p>Aucune mission disponible pour ce filtre.</p>
                    </div>
                  ) : (
                    filteredMissions.map((mission) => (
                      <button
                        key={mission.id}
                        className={`mission-row mission-row--${mission.status?.toLowerCase() || 'assigned'}`}
                        onClick={() => openModal(mission)}
                      >
                        <span className={`mission-status-pill mission-status-pill--${mission.status?.toLowerCase() || 'assigned'}`}>
                          {getStatusLabel(mission.status)}
                        </span>

                        <div className="mission-row__info">
                          <strong className="mission-row__title">{mission.title}</strong>
                          <span className="mission-row__id">{mission.id}</span>
                        </div>

                        <div className="mission-row__route">
                          <span className="route-addr">📍 {mission.pickup}</span>
                          <span className="mission-row__arrow">→</span>
                          <span className="route-addr">🎯 {mission.dropoff}</span>
                        </div>

                        <div className="mission-row__meta">
                          <span>{mission.distance} km · {mission.duration} min</span>
                          <strong className="mission-row__price">{mission.price.toLocaleString('fr-FR')} F</strong>
                        </div>

                        <svg className="mission-row__chevron" width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          </section>

          {error && <div className="alert alert--danger">{error}</div>}
        </section>
      </main>

      {/* ══ MISSION MODAL ══ */}
      {modalOpen && selectedMission && (
        <div
          className="mission-modal__overlay"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Détails de la mission"
        >
          <div className="mission-modal" onClick={(e) => e.stopPropagation()}>

            {/* Header */}
            <div className="mission-modal__header">
              <div className="mission-modal__header-top">
                <div>
                  <h2 className="mission-modal__title">{selectedMission.title}</h2>
                  <p className="mission-modal__id">{selectedMission.id}</p>
                </div>
                <button className="mission-modal__close" onClick={closeModal} aria-label="Fermer">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
              <span className={`mission-status-pill mission-status-pill--${selectedMission.status?.toLowerCase() || 'assigned'}`}>
                {getStatusLabel(selectedMission.status)}
              </span>
            </div>

            {/* Body */}
            <div className="mission-modal__body">

              {/* Itinéraire */}
              <div className="modal-section">
                <h3 className="modal-section__title">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                    <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 6.9 8 11.7z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  Itinéraire
                </h3>
                <div className="modal-route">
                  <div className="modal-route__point">
                    <div className="modal-route__dot modal-route__dot--start">A</div>
                    <div className="modal-route__text">
                      <span className="modal-route__label">Chargement</span>
                      <p className="modal-route__address">{selectedMission.pickup}</p>
                    </div>
                  </div>
                  <div className="modal-route__connector">
                    <div className="modal-route__line"></div>
                    <span className="modal-route__distance">
                      {selectedMission.distance} km · {selectedMission.duration} min
                    </span>
                  </div>
                  <div className="modal-route__point">
                    <div className="modal-route__dot modal-route__dot--end">B</div>
                    <div className="modal-route__text">
                      <span className="modal-route__label">Livraison</span>
                      <p className="modal-route__address">{selectedMission.dropoff}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Matériau + Client */}
              <div className="modal-info-grid">
                <div className="modal-section">
                  <h3 className="modal-section__title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Matériau
                  </h3>
                  <p className="modal-info__value">{selectedMission.title}</p>
                  <p className="modal-info__sub">{selectedMission.volumeLabel}</p>
                </div>
                <div className="modal-section">
                  <h3 className="modal-section__title">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Client
                  </h3>
                  <p className="modal-info__value">{selectedMission.customer}</p>
                  <a href={`tel:${selectedMission.phone}`} className="modal-phone">{selectedMission.phone}</a>
                </div>
              </div>

              {/* Rémunération */}
              <div className="modal-payment">
                <span className="modal-payment__label">Rémunération</span>
                <strong className="modal-payment__amount">
                  {selectedMission.price.toLocaleString('fr-FR')} <span>FCFA</span>
                </strong>
              </div>

            </div>

            {/* Footer / Actions */}
            <div className="mission-modal__footer">
              {selectedMission.status === 'assigned' && (
                <button
                  className="button button--primary button--large"
                  onClick={() => { updateMissionStatus(selectedMission, 'in_progress'); closeModal() }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <polygon points="5 3 19 12 5 21 5 3" fill="currentColor"/>
                  </svg>
                  Démarrer la mission
                </button>
              )}

              {selectedMission.status === 'in_progress' && (
                <button
                  className="button button--success button--large"
                  onClick={() => { updateMissionStatus(selectedMission, 'completed'); closeModal() }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Confirmer la livraison
                </button>
              )}

              <button className="button button--outline" onClick={() => { openTrackingPage(); closeModal() }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 6.9 8 11.7z" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Ouvrir le GPS
              </button>

              {(selectedMission.status === 'completed' || selectedMission.status === 'delivered') && (
                <button className="button button--ghost" onClick={downloadTicket}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <polyline points="7 10 12 15 17 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    <line x1="12" y1="15" x2="12" y2="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Télécharger l'e-ticket
                </button>
              )}

              <button className="button button--ghost" onClick={closeModal}>Fermer</button>
            </div>

          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
