import { useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  FilePlus, 
  LogOut, 
  Menu, 
  X, 
  User, 
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../types/auth';
import Button from '../components/ui/Button';
const { user, logout, updateUserFromApi } = useAuth();


const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  useEffect(() => {
    updateUserFromApi();
  }, []);

  const isAdmin = user?.role === UserRole.ADMIN || user?.role === UserRole.SUPER_ADMIN;
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN;

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" />,
      roles: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN]
    },
    { 
      name: 'Content', 
      path: '/content', 
      icon: <FileText className="h-5 w-5" />,
      roles: [UserRole.USER, UserRole.ADMIN, UserRole.SUPER_ADMIN]
    },
    { 
      name: 'Create Content', 
      path: '/content/create', 
      icon: <FilePlus className="h-5 w-5" />,
      roles: [UserRole.ADMIN, UserRole.SUPER_ADMIN]
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(user?.role as UserRole)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-20 transition-opacity ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-gray-600 opacity-75" onClick={toggleSidebar}></div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 transform overflow-y-auto bg-indigo-700 transition duration-300 lg:static lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between bg-indigo-800 px-6">
          <div className="flex items-center text-xl font-semibold text-white">
            Content Platform
          </div>
          <button
            className="text-white focus:outline-none lg:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4">
          <div className="space-y-2">
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-800 text-white'
                      : 'text-indigo-100 hover:bg-indigo-600'
                  }`
                }
                onClick={() => setIsSidebarOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                {item.name}
              </NavLink>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex w-full flex-1 flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="relative z-10 flex h-16 items-center justify-between bg-white px-6 shadow-sm">
          <button
            className="rounded-md p-1 text-gray-500 focus:outline-none focus:ring lg:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="relative">
            <button
              className="flex items-center rounded-full p-1 focus:outline-none focus:ring"
              onClick={toggleUserMenu}
            >
              <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center">
                <User className="h-5 w-5 text-indigo-700" />
              </div>
              <span className="ml-2 text-sm font-medium text-gray-700">
                {user?.name}
                <span className="ml-1 text-xs text-gray-500">
                  ({user?.role.replace('_', ' ')})
                </span>
              </span>
              <ChevronDown className="ml-1 h-4 w-4 text-gray-500" />
            </button>

            {/* User dropdown menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <button
                  className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;