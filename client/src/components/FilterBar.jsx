export default function FilterBar({ statusFilter, priorityFilter, onStatusChange, onPriorityChange }) {
  return (
    <div className="filter-panel">
      <div className="filter-group">
        <span className="filter-label">Status</span>
        <div className="segmented-control">
          {['all', 'pending', 'completed'].map((status) => (
            <button
              key={status}
              type="button"
              className={statusFilter === status ? 'active' : ''}
              onClick={() => onStatusChange(status)}
            >
              {status === 'all' ? 'All' : status === 'pending' ? 'Pending' : 'Completed'}
            </button>
          ))}
        </div>
      </div>

      <div className="filter-group">
        <span className="filter-label">Priority</span>
        <div className="segmented-control">
          {['all', 'Low', 'Medium', 'High'].map((priority) => (
            <button
              key={priority}
              type="button"
              className={priorityFilter === priority ? 'active' : ''}
              onClick={() => onPriorityChange(priority)}
            >
              {priority === 'all' ? 'All' : priority}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
