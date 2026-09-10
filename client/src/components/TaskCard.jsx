import { CalendarDays, CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';

const priorityClassMap = {
  Low: 'priority-low',
  Medium: 'priority-medium',
  High: 'priority-high',
};

function formatDate(dateString) {
  if (!dateString) return 'No due date';

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return 'No due date';
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const isCompleted = Boolean(task.completed);

  return (
    <article className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div className="task-card-main">
        <button
          type="button"
          className="checkbox-button"
          aria-label={isCompleted ? 'Mark as pending' : 'Mark as complete'}
          onClick={() => onToggle(task._id)}
        >
          {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>

        <div className="task-content">
          <div className="task-header-row">
            <h3>{task.title}</h3>
            <span className={`priority-badge ${priorityClassMap[task.priority] || 'priority-medium'}`}>
              {task.priority}
            </span>
          </div>

          {task.description && <p className="task-description">{task.description}</p>}

          <div className="task-meta">
            <span className="meta-chip">
              <CalendarDays size={14} />
              {formatDate(task.dueDate)}
            </span>
            <span className="meta-chip state-chip">
              {isCompleted ? 'Completed' : 'Pending'}
            </span>
          </div>

          {isCompleted && task.completedAt && (
            <p className="completion-note">Completed on {formatDate(task.completedAt)}</p>
          )}
        </div>
      </div>

      <div className="task-actions">
        <button type="button" className="text-button" onClick={() => onEdit(task)}>
          <Pencil size={15} />
          Edit
        </button>
        <button type="button" className="text-button danger-text-button" onClick={() => onDelete(task)}>
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </article>
  );
}
