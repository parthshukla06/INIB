export default function Toast({ toasts, onClose }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <div className="toast-content">
            <span className="toast-dot" aria-hidden="true" />
            <span>{toast.message}</span>
          </div>
          <button type="button" onClick={() => onClose(toast.id)} aria-label="Dismiss notification">
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
