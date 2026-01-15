import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Home, Notebook, Wallet, Bell, User, LogOut } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function PortalLayout() {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { path: '/portal', icon: Home, label: 'Início' },
        { path: '/portal/diary', icon: Notebook, label: 'Diário' },
        { path: '/portal/financial', icon: Wallet, label: 'Pagamentos' },
        { path: '/portal/notices', icon: Bell, label: 'Avisos' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans pb-20">
            {/* Header Mobile */}
            <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-30 flex justify-between items-center shadow-sm">
                <div>
                    <h1 className="text-lg font-bold text-gray-800">Olá, Responsável</h1>
                    <p className="text-xs text-gray-500">Escola Tia Sol</p>
                </div>
                <button onClick={logout} className="text-gray-400 hover:text-red-500">
                    <LogOut size={20} />
                </button>
            </header>

            {/* Conteúdo Principal */}
            <main className="p-4 max-w-lg mx-auto">
                <Outlet />
            </main>

            {/* Bottom Navigation (Mobile) */}
            <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center z-40 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] md:max-w-lg md:mx-auto md:rounded-t-2xl md:bottom-0">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className="flex flex-col items-center gap-1 min-w-[60px]"
                        >
                            <div className={cn(
                                "p-2 rounded-full transition-all",
                                isActive ? "bg-orange-100 text-orange-600 translate-y-[-5px]" : "text-gray-400"
                            )}>
                                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                            </div>
                            <span className={cn(
                                "text-[10px] font-medium",
                                isActive ? "text-orange-600" : "text-gray-400"
                            )}>
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
