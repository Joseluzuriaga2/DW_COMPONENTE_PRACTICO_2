export default function StatCard({ icon, label, value, variant = 'default' }) {
  return (
    <article className={`stat-card stat-card-${variant}`}>
      <span className="stat-card-icon">{icon}</span>
      <p className="stat-card-value">{value}</p>
      <p className="stat-card-label">{label}</p>
    </article>
  );
}
