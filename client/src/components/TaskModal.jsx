import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const emptyForm = {
  title: '',
  description: '',
  priority: 'Medium',
  dueDate: '',
};

export default function TaskModal({ isOpen, mode, task, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    if (mode === 'edit' && task) {
      setForm({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'Medium',
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
      });
    } else {
      setForm(emptyForm);
    }

    setErrors({});
  }, [isOpen, mode, task]);

  if (!isOpen) {
    return null;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
  };

  const validateForm = () => {
    const nextErrors = {};
    if (!form.title || !form.title.trim()) {
      nextErrors.title = 'Task title is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit({
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(event) => event.stopPropagation()} role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
        <div className="modal-header">
          <div>
            <p className="eyebrow">Task</p>
            <h2 id="task-modal-title">{mode === 'edit' ? 'Edit task' : 'Add task'}</h2>
          </div>
          <button type="button" className="icon-button modal-close" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <label>
            <span>Title</span>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Finish landing page mockup"
              className={errors.title ? 'input-error' : ''}
            />
            {errors.title && <small className="field-error">{errors.title}</small>}
          </label>

          <label>
            <span>Description</span>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write a clear summary of the task"
              rows="4"
            />
          </label>

          <div className="form-row">
            <label>
              <span>Priority</span>
              <select name="priority" value={form.priority} onChange={handleChange}>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </label>

            <label>
              <span>Due Date</span>
              <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={isSubmitting}>
              {isSubmitting ? (mode === 'edit' ? 'Saving...' : 'Creating...') : mode === 'edit' ? 'Save changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
