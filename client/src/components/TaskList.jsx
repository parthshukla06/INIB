import TaskCard from './TaskCard';

export default function TaskList({ tasks, onToggle, onEdit, onDelete, emptyTitle, emptyDescription }) {
  if (!tasks.length) {
    return (
      <div className="empty-state">
        <h3>{emptyTitle}</h3>
        <p>{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onToggle={onToggle}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
