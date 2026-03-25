const STATUS_LABELS = {
  assigned: 'Assignée',
  in_progress: 'En cours',
  delivered: 'Livrée',
  completed: 'Livrée',
  rejected: 'Refusée',
}

export function MissionCard({ mission }) {
  if (!mission) return null

  const statusLabel = STATUS_LABELS[mission.status] || mission.status || 'Inconnue'

  return (
    <article className="mission-card">
      <div className="mission-card__header">
        <div className="mission-card__title">
          <strong>{mission.title}</strong>
          <span className="mission-card__subtitle">{mission.id}</span>
        </div>
        <div className="mission-card__price">
          <div className="mission-card__priceValue">{mission.price?.toLocaleString?.('fr-FR') ?? mission.price}</div>
          <span className="mission-card__priceUnit">FCFA</span>
        </div>
      </div>

      <div className="mission-card__locations">
        <div className="mission-card__location">
          <span className="mission-card__locationIcon" aria-hidden>
            ⬆
          </span>
          <div>
            <div className="mission-card__locationTitle">Récupération</div>
            <div className="mission-card__locationDetail">{mission.pickup}</div>
          </div>
        </div>
        <div className="mission-card__location">
          <span className="mission-card__locationIcon" aria-hidden>
            ⬇
          </span>
          <div>
            <div className="mission-card__locationTitle">Livraison</div>
            <div className="mission-card__locationDetail">{mission.dropoff}</div>
          </div>
        </div>
      </div>

      <div className="mission-card__meta">
        <span className="mission-card__metaItem">Volume: {mission.volumeLabel || '-'}</span>
        <span className="mission-card__metaItem">Distance: {mission.distance} km</span>
        <span className="mission-card__metaItem">Durée: {mission.duration} min</span>
      </div>

      <div className="mission-card__customer">
        <span>{mission.customer}</span>
        <span>{mission.phone}</span>
      </div>

      <span className="mission-card__status" data-status={mission.status}>
        {statusLabel}
      </span>
    </article>
  )
}
