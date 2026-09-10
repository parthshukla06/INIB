export default function DeleteConfirmModal({ isOpen, taskTitle, onClose, onConfirm, isDeleting }) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card confirm-card" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="delete-title">
        <h2 id="delete-title">Delete task</h2>
        <p>
          Are you sure you want to delete <strong>{taskTitle}</strong>?
        </p>

        <div className="modal-actions">
          <button type="button" className="secondary-button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="danger-button" onClick={onConfirm} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
