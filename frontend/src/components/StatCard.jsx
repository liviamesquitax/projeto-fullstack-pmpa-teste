function StatCard({ label, value, isLoading }) {
  return (
    <div className="stat-card">
      <p className="stat-label">{label}</p>
      <p className="stat-value">{isLoading ? "..." : value}</p>
    </div>
  );
}

export default StatCard;
