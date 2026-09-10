import { CheckCheck, CircleDashed, LayoutDashboard, ListTodo, Settings } from 'lucide-react';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'all', label: 'All Tasks', icon: ListTodo },
  { key: 'pending', label: 'Pending', icon: CircleDashed },
  { key: 'completed', label: 'Completed', icon: CheckCheck },
  { key: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ activeSection, onSelect }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav" aria-label="Sidebar navigation">
        {navItems.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            className={`nav-item ${activeSection === key ? 'active' : ''}`}
            onClick={() => onSelect(key)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
