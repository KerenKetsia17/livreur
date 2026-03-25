export function StatCard({ label, value, icon, unit }) {
  return (
    <article className="stat-card">
      <div className="stat-card__header">
        <div className="stat-card__icon" aria-hidden>
          {icon}
        </div>
        <span className="stat-card__label">{label}</span>
      </div>
      <div className="stat-card__value">
        {value}
        {unit ? <span className="stat-card__unit">{unit}</span> : null}
      </div>
    </article>
  )
}
