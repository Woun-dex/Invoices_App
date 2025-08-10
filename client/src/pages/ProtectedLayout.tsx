import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut } from 'lucide-react';

// A helper for NavLink styling
const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? 'bg-gray-900 text-white'
      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
  }`;

function TopNav() {
  const { user, logout } = useAuth();
  return (
    <nav className="bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <span className="font-bold text-white text-lg">InvoiceApp</span>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/" className={navLinkClasses} end>Dashboard</NavLink>
                <NavLink to="/clients" className={navLinkClasses}>Clients</NavLink>
                <NavLink to="/invoices" className={navLinkClasses}>Invoices</NavLink>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-400 mr-4">Welcome, {user?.username}</span>
            <button
              onClick={logout}
              className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Log out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}


export default function ProtectedLayout() {
  const { token, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading application...</div>;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNav />
      <main>
        <div className="container mx-auto py-6 px-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
