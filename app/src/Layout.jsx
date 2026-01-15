import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { LayoutDashboard, Users, Wallet, Bell, LogOut, Sun, BookOpen, Briefcase, Notebook, User } from 'lucide-react';
import { cn } from './lib/utils';

export default function Layout() {
    const { user, role, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: 'Painel', roles: ['admin', 'teacher'] },
        { path: '/students', icon: Users, label: 'Alunos', roles: ['admin', 'teacher'] },
        { path: '/guardians', icon: User, label: 'Responsáveis', roles: ['admin', 'teacher'] },
        { path: '/classes', icon: BookOpen, label: 'Turmas', roles: ['admin', 'teacher'] },
        { path: '/staff', icon: Briefcase, label: 'Funcionários', roles: ['admin'] },
        { path: '/financial', icon: Wallet, label: 'Financeiro', roles: ['admin'] },
        { path: '/pedagogical', icon: Notebook, label: 'Diário', roles: ['admin', 'teacher'] },
        { path: '/notices', icon: Bell, label: 'Avisos', roles: ['admin', 'teacher'] },
    ];

    // Filtra itens baseados no cargo
    const filteredNavItems = navItems.filter(item =>
        !item.roles || item.roles.includes(role || 'teacher') // Default to teacher if role not loaded yet
    );

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col fixed inset-y-0 left-0 z-50">
                <div className="p-6 flex items-center gap-3 border-b border-gray-50 h-16">
                    <Sun className="text-orange-500 shrink-0" size={24} />
                    <span className="font-bold text-lg text-gray-800 tracking-tight">Tia Sol</span>
                </div>

                <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
                    <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">Menu</p>
                    {filteredNavItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-orange-50 text-orange-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <item.icon size={20} className={isActive ? "text-orange-500" : "text-gray-400"} />
                                {item.label}
                            </Link>
                        )
                    })}
                </div>

                <div className="p-4 border-t border-gray-50">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-xs">
                            TS
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="w-full flex items-center justify-center gap-2 text-sm text-red-500 hover:bg-red-50 p-2 rounded transition-colors cursor-pointer"
                    >
                        <LogOut size={16} />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:pl-64 flex flex-col min-h-screen">
                <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 md:hidden shadow-sm z-40 sticky top-0">
                    <div className="flex items-center gap-2">
                        <Sun className="text-orange-500" size={24} />
                        <span className="font-bold text-lg text-gray-800">Tia Sol</span>
                    </div>
                    {/* Mobile Menu Trigger would go here */}
                </header>

                <div className="p-8 flex-1">
                    <div className="max-w-6xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
}
