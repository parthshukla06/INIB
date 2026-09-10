export default function StatsCard({ label, value, accent, icon: Icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <span className="stat-label">{label}</span>
        {Icon && <Icon size={18} className={`stat-icon ${accent}`} />}
      </div>
      <strong className="stat-value">{value}</strong>
    </div>
  );
}
