import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck2, CheckCircle2, CircleDashed, Plus, Target, TriangleAlert } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import StatsCard from '../components/StatsCard';
import TaskList from '../components/TaskList';
import TaskModal from '../components/TaskModal';
import DeleteConfirmModal from '../components/DeleteConfirmModal';
import FilterBar from '../components/FilterBar';
import Toast from '../components/Toast';
import { createTask, deleteTask, getTasks, toggleTask, updateTask } from '../services/taskApi';

const initialFilters = {
  status: 'all',
  priority: 'all',
};

export default function Dashboard({ theme, onToggleTheme, user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(initialFilters);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedTask, setSelectedTask] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((currentToasts) => [...currentToasts, { id, message, type }]);
    window.setTimeout(() => {
      setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
    }, 2800);
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks();
      setTasks(response);
      setError('');
    } catch (err) {
      setError('Unable to load tasks right now. Please try again later.');
      showToast('Failed to fetch tasks from the server.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((task) => !task.completed).length;
    const completed = tasks.filter((task) => task.completed).length;
    const highPriority = tasks.filter((task) => task.priority === 'High').length;

    return { total, pending, completed, highPriority };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !normalizedSearch ||
        task.title?.toLowerCase().includes(normalizedSearch) ||
        task.description?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        filters.status === 'all' ||
        (filters.status === 'pending' && !task.completed) ||
        (filters.status === 'completed' && task.completed);

      const matchesPriority =
        filters.priority === 'all' || task.priority === filters.priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [tasks, searchTerm, filters]);

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setModalMode('edit');
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const onSubmitTask = async (taskData) => {
    try {
      setIsSubmitting(true);

      if (modalMode === 'edit' && selectedTask) {
        const updatedTask = await updateTask(selectedTask._id, taskData);
        setTasks((currentTasks) =>
          currentTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
        );
        showToast('Task updated successfully.', 'success');
      } else {
        const createdTask = await createTask(taskData);
        setTasks((currentTasks) => [createdTask, ...currentTasks]);
        showToast('Task created successfully.', 'success');
      }

      handleCloseModal();
    } catch (err) {
      const message = err?.response?.data?.message || 'Something went wrong while saving the task.';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      const updatedTask = await toggleTask(taskId);
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
      );
      showToast(
        updatedTask.completed ? 'Task marked as complete.' : 'Task marked as pending.',
        'success'
      );
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to update task status.';
      showToast(message, 'error');
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTarget) return;

    try {
      setIsDeleting(true);
      await deleteTask(deleteTarget._id);
      setTasks((currentTasks) => currentTasks.filter((task) => task._id !== deleteTarget._id));
      setDeleteTarget(null);
      showToast('Task deleted successfully.', 'success');
    } catch (err) {
      const message = err?.response?.data?.message || 'Unable to delete task.';
      showToast(message, 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const renderSectionTitle = () => {
    switch (activeSection) {
      case 'pending':
        return 'Pending tasks';
      case 'completed':
        return 'Completed tasks';
      case 'all':
        return 'All tasks';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  const renderSettingsView = () => (
    <div className="settings-grid">
      <div className="settings-card">
        <p className="eyebrow">Theme</p>
        <h3>Appearance</h3>
        <p>Switch between light and dark mode anytime.</p>
      </div>
      <div className="settings-card">
        <p className="eyebrow">Focus</p>
        <h3>Productivity</h3>
        <p>Keep your task flow organised around priorities and deadlines.</p>
      </div>
      <div className="settings-card">
        <p className="eyebrow">Workspace</p>
        <h3>Overview</h3>
        <p>{tasks.length} tasks currently tracked across your workspace.</p>
      </div>
    </div>
  );

  const dashboardTasks = activeSection === 'pending'
    ? tasks.filter((task) => !task.completed)
    : activeSection === 'completed'
      ? tasks.filter((task) => task.completed)
      : tasks;

  const listTitle = activeSection === 'dashboard' ? 'My Tasks' : renderSectionTitle();

  const displayedTasks = activeSection === 'dashboard'
    ? filteredTasks
    : dashboardTasks.filter((task) => {
        const normalizedSearch = searchTerm.trim().toLowerCase();
        if (!normalizedSearch) return true;
        return (
          task.title?.toLowerCase().includes(normalizedSearch) ||
          task.description?.toLowerCase().includes(normalizedSearch)
        );
      });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="app-shell">
      <Sidebar activeSection={activeSection} onSelect={setActiveSection} />

      <div className="content-shell">
        <Navbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          theme={theme}
          onToggleTheme={onToggleTheme}
          user={user}
          onLogout={onLogout}
        />

        <main className="main-content">
          {activeSection === 'dashboard' && (
            <section className="welcome-panel">
              <div>
                <p className="eyebrow">Overview</p>
                <h2>{getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋</h2>
                <p>Here&apos;s what&apos;s happening with your tasks.</p>
              </div>
              <button type="button" className="primary-button add-button" onClick={handleOpenCreateModal}>
                <Plus size={16} />
                Add Task
              </button>
            </section>
          )}

          {activeSection === 'dashboard' && !loading && !error && (
            <section className="stats-grid">
              <StatsCard label="Total" value={stats.total} accent="accent-blue" icon={CalendarCheck2} />
              <StatsCard label="Pending" value={stats.pending} accent="accent-orange" icon={CircleDashed} />
              <StatsCard label="Completed" value={stats.completed} accent="accent-green" icon={CheckCircle2} />
              <StatsCard label="High Priority" value={stats.highPriority} accent="accent-red" icon={Target} />
            </section>
          )}

          <section className="task-panel">
            <div className="task-panel-header">
              <div>
                <p className="eyebrow">Workspace</p>
                <h2>{listTitle}</h2>
              </div>
              {activeSection === 'dashboard' && (
                <button type="button" className="primary-button" onClick={handleOpenCreateModal}>
                  <Plus size={16} />
                  New Task
                </button>
              )}
            </div>

            {activeSection === 'dashboard' && (
              <FilterBar
                statusFilter={filters.status}
                priorityFilter={filters.priority}
                onStatusChange={(value) => setFilters((current) => ({ ...current, status: value }))}
                onPriorityChange={(value) => setFilters((current) => ({ ...current, priority: value }))}
              />
            )}

            {activeSection === 'settings' ? (
              renderSettingsView()
            ) : loading ? (
              <div className="loading-state">
                <div className="spinner" />
                <p>Loading your tasks...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <TriangleAlert size={20} />
                <p>{error}</p>
              </div>
            ) : (
              <TaskList
                tasks={displayedTasks}
                onToggle={handleToggleTask}
                onEdit={handleOpenEditModal}
                onDelete={(task) => setDeleteTarget(task)}
                emptyTitle={
                  activeSection === 'dashboard'
                    ? 'You\'re all caught up!'
                    : 'No tasks in this view.'
                }
                emptyDescription={
                  activeSection === 'dashboard'
                    ? 'Create a task to get started.'
                    : 'No tasks match your current filters.'
                }
              />
            )}
          </section>
        </main>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        mode={modalMode}
        task={selectedTask}
        onClose={handleCloseModal}
        onSubmit={onSubmitTask}
        isSubmitting={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteTarget)}
        taskTitle={deleteTarget?.title || ''}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteTask}
        isDeleting={isDeleting}
      />

      <Toast toasts={toasts} onClose={(id) => setToasts((current) => current.filter((toast) => toast.id !== id))} />
    </div>
  );
}
