import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { doc, setDoc } from 'firebase/firestore'
import { BrandHeader } from '../components/BrandHeader'
import { BottomNav } from '../components/BottomNav'
import { MissionDetail } from './MissionDetail'
import '../css/pages/DriverDashboard.css'
import { getCurrentPosition } from '../utils/geo'
import {
  addDriverNotification,
  getCurrentUser,
  getDriverNotifications,
  setCurrentTrackingMission,
  setDriverNotifications,
} from '../utils/storage'
import { useOrders } from '../hooks/useOrders'
import { db, auth } from '../firebase'

const tabOptions = [
  { key: 'all', label: 'Toutes' },
  { key: 'in_progress', label: 'En cours' },
  { key: 'assigned', label: 'A realiser' },
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
        pushNotification('Mission dÃ©marrÃ©e', `Votre mission est maintenant en cours.`)
      }

      if (status === 'completed') {
        const completedMission = { ...mission, status: 'completed' }
        pushNotification('Livraison confirmÃ©e', `Livraison effectuÃ©e. Ouverture du suivi GPS.`)
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
    pushNotification('Mission acceptÃ©e', `Vous avez acceptÃ© la mission : ${incomingMission.title}.`)
  }

  function dismissIncomingMission() {
    if (!incomingMission) return
    pushNotification('Mission ignorÃ©e', `Vous avez ignorÃ© la mission : ${incomingMission.title}.`)
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
      assigned: 'A realiser',
      in_progress: 'En cours',
      delivered: 'Livree',
      completed: 'Terminee',
    }
    return labels[status] || status
  }

  function downloadTicket() {
    if (!selectedMission || (selectedMission.status !== 'completed' && selectedMission.status !== 'delivered')) return

    const content = [
      'CAMIONSUF - E-TICKET',
      `Commande pour ${selectedMission.customer}`,
      `Materiau: ${selectedMission.title}`,
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

  // Mission active en cours
  const currentMission = useMemo(() => missionPool.find(m => m.status === 'in_progress'), [missionPool])

  const driverName =
    auth.currentUser?.displayName ||
    auth.currentUser?.email?.split('@')[0] ||
    user?.name ||
    'Chauffeur'
  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <div className="app driver-dashboard">
      <BrandHeader />
      <main className="page driver-dashboard__page">

        {/* â•â• EN-TÃŠTE â•â• */}
        <header className="db-header">
          <div className="db-header__left">
            <div className="db-avatar">{driverName[0]?.toUpperCase() ?? '?'}</div>
            <div>
              <p className="db-header__name">Bonjour, {driverName}</p>
              <p className="db-header__date">{today}</p>
            </div>
          </div>
          <div className="db-status-badge">
            <span className="db-status-badge__dot"></span>
            En ligne
          </div>
        </header>

        {/* â•â• STATISTIQUES â•â• */}
        <div className="db-stats-strip">
          <div className="db-stat db-stat--info">
            <span className="db-stat__value">{stats.total}</span>
            <span className="db-stat__label">Total missions</span>
          </div>
          <div className="db-stat db-stat--warning">
            <span className="db-stat__value">{stats.inProgress}</span>
            <span className="db-stat__label">En cours</span>
          </div>
          <div className="db-stat db-stat--info">
            <span className="db-stat__value">{stats.assigned}</span>
            <span className="db-stat__label">A realiser</span>
          </div>
          <div className="db-stat db-stat--success">
            <span className="db-stat__value">{stats.delivered}</span>
            <span className="db-stat__label">Livrees</span>
          </div>
          <div className="db-stat db-stat--accent">
            <span className="db-stat__value">{stats.todayRevenue > 0 ? stats.todayRevenue.toLocaleString('fr-FR') + ' F' : '-'}</span>
            <span className="db-stat__label">FCFA gagnes</span>
          </div>
        </div>

        {/* â•â• ALERTE â€” NOUVELLE MISSION â•â• */}
        {incomingMission && (
          <section className="incoming-mission-alert" role="status" aria-live="polite">
            <div className="incoming-mission-alert__header">
              <div className="incoming-mission-alert__badge">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Nouvelle mission disponible</span>
              </div>
            </div>
            <div className="incoming-mission-alert__content">
              <h3 className="incoming-mission-alert__title">{incomingMission.title}</h3>
              <div className="incoming-mission-alert__route">
                <div className="route-point">
                  <span className="route-point__icon">ðŸ“</span>
                  <div className="route-point__info">
                    <span className="route-point__label">Chargement</span>
                    <p className="route-point__address">{incomingMission.pickup}</p>
                  </div>
                </div>
                <div className="route-connector"></div>
                <div className="route-point">
                  <span className="route-point__icon">ðŸŽ¯</span>
                  <div className="route-point__info">
                    <span className="route-point__label">Livraison</span>
                    <p className="route-point__address">{incomingMission.dropoff}</p>
                  </div>
                </div>
              </div>
              <div className="incoming-mission-alert__meta">
                <div className="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2"/></svg>
                  <span>{incomingMission.volumeLabel}</span>
                </div>
                <div className="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/><path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 6.9 8 11.7z" stroke="currentColor" strokeWidth="2"/></svg>
                  <span>{incomingMission.distance} km</span>
                </div>
                <div className="meta-item">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                  <span>{incomingMission.duration} min</span>
                </div>
                <div className="meta-item meta-item--price">
                  <strong>{incomingMission.price.toLocaleString('fr-FR')} FCFA</strong>
                </div>
              </div>
            </div>
            <div className="incoming-mission-alert__actions">
              <button className="button button--primary button--large" onClick={acceptIncomingMission}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><polyline points="20 6 9 17 4 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Accepter
              </button>
              <button className="button button--ghost" onClick={dismissIncomingMission}>Ignorer</button>
            </div>
          </section>
        )}

        {/* â•â• MISSION ACTIVE â•â• */}
        {currentMission && (
          <div className="db-current-mission">
            <div className="db-current-mission__header">
              <h2 className="db-current-mission__title">Mission en cours</h2>
              <span className="db-badge db-badge--active">
                <span className="db-status-badge__dot" style={{background:'#fff'}}></span>
                En Livraison
              </span>
            </div>
            <div className="db-current-mission__body">
              <div className="db-current-mission__row">
                <span className="db-current-mission__label">MatÃ©riau :</span>
                <span className="db-current-mission__value">{currentMission.title}</span>
              </div>
              <div className="db-current-mission__row">
                <span className="db-current-mission__label">Destination :</span>
                <span className="db-current-mission__value">{currentMission.dropoff}</span>
              </div>
              <div className="db-current-mission__row">
                <span className="db-current-mission__label">Client :</span>
                <span className="db-current-mission__value">{currentMission.customer}</span>
              </div>
              <div className="db-current-mission__row">
                <span className="db-current-mission__label">Distance :</span>
                <span className="db-current-mission__value">{currentMission.distance} km Â· {currentMission.duration} min</span>
              </div>
            </div>
            <button
              className="db-current-mission__btn"
              onClick={() => {
                setCurrentTrackingMission(currentMission)
                navigate('/driver/tracking')
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 10-16 0c0 3 2.7 6.9 8 11.7z" stroke="currentColor" strokeWidth="2"/>
              </svg>
              Suivre sur la carte GPS
            </button>
          </div>
        )}

        {/* â•â• LISTE DES MISSIONS â•â• */}
        <div className="db-missions">
          <div className="db-missions__top">
            <h2 className="db-missions__title">
              Toutes les missions
              <span className="db-missions__count">{filteredMissions.length}</span>
            </h2>
            <div className="db-tabs">
              {tabOptions.map(tab => (
                <button
                  key={tab.key}
                  className={`db-tab${activeTab === tab.key ? ' db-tab--active' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loading && <p className="db-loading">Synchronisation en coursâ€¦</p>}
          {error && <div className="alert alert--danger" style={{margin:'8px 12px'}}>{error}</div>}

          {!loading && filteredMissions.length === 0 ? (
            <div className="db-empty">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              <p>Aucune mission dans cette catÃ©gorie</p>
            </div>
          ) : (
            <div className="db-mission-list">
              {filteredMissions.map(mission => (
                <button
                  key={mission.id}
                  className={`db-mission-item db-mission-item--${mission.status}`}
                  onClick={() => openModal(mission)}
                >
                  <div className="db-mission-item__left">
                    <span className={`db-pill db-pill--${mission.status}`}>
                      {getStatusLabel(mission.status)}
                    </span>
                    <span className="db-mission-item__id">Commande pour {mission.customer}</span>
                  </div>

                  <div className="db-mission-item__info">
                    <span className="db-mission-item__title">{mission.title}</span>
                    <span className="db-mission-item__id">{mission.customer}</span>
                  </div>

                  <div className="db-mission-item__route">
                    <div className="db-route-pt db-route-pt--start">
                      <span className="db-route-pt__dot"></span>
                      <span>{mission.pickup}</span>
                    </div>
                    <div className="db-route-connector"></div>
                    <div className="db-route-pt db-route-pt--end">
                      <span className="db-route-pt__dot"></span>
                      <span>{mission.dropoff}</span>
                    </div>
                  </div>

                  <div className="db-mission-item__metrics">
                    <span>{mission.distance} km</span>
                    <span>{mission.duration} min</span>
                  </div>

                  <div className="db-mission-item__price">
                    {mission.price.toLocaleString('fr-FR')} <small>FCFA</small>
                  </div>

                  <svg className="db-mission-item__chevron" width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              ))}
            </div>
          )}
        </div>

      </main>
      <BottomNav />

      {/* â•â• MISSION DETAIL MODAL â•â• */}
      {modalOpen && selectedMission && (
        <MissionDetail
          mission={selectedMission}
          onClose={() => setModalOpen(false)}
        />
      )}

    </div>
  )
}
