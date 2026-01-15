import { Link } from 'react-router-dom';
import { Users, Wallet, Bell, BookOpen, Notebook } from 'lucide-react';

export default function Dashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Visão Geral</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Alunos Ativos</h3>
                    <p className="text-3xl font-bold text-gray-900">24</p>
                    <div className="mt-4 flex items-center text-xs text-green-600 bg-green-50 w-max px-2 py-1 rounded-full">
                        +2 esse mês
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Faturamento (Mês)</h3>
                    <p className="text-3xl font-bold text-gray-900">R$ 12.450,00</p>
                    <div className="mt-4 flex items-center text-xs text-gray-500">
                        Previsto: R$ 14.000
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-1">Pendências</h3>
                    <p className="text-3xl font-bold text-gray-900">2</p>
                    <div className="mt-4 flex items-center text-xs text-red-600 bg-red-50 w-max px-2 py-1 rounded-full">
                        Atenção necessária
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <span className="w-1 h-5 bg-orange-500 rounded-full"></span>
                        Acesso Rápido
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <Link to="/students" className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group flex flex-col items-center gap-2 text-center">
                            <div className="w-10 h-10 rounded-full bg-orange-100 group-hover:bg-white flex items-center justify-center text-orange-600 transition-colors">
                                <Users size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">Alunos</span>
                        </Link>
                        <Link to="/classes" className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group flex flex-col items-center gap-2 text-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 group-hover:bg-white flex items-center justify-center text-blue-600 transition-colors">
                                <BookOpen size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">Turmas</span>
                        </Link>
                        <Link to="/financial" className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group flex flex-col items-center gap-2 text-center">
                            <div className="w-10 h-10 rounded-full bg-green-100 group-hover:bg-white flex items-center justify-center text-green-600 transition-colors">
                                <Wallet size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-green-700">Financeiro</span>
                        </Link>
                        <Link to="/pedagogical" className="p-4 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group flex flex-col items-center gap-2 text-center">
                            <div className="w-10 h-10 rounded-full bg-purple-100 group-hover:bg-white flex items-center justify-center text-purple-600 transition-colors">
                                <Notebook size={20} />
                            </div>
                            <span className="text-sm font-medium text-gray-700 group-hover:text-purple-700">Diário</span>
                        </Link>
                    </div>
                </div>

                <div className="md:w-80 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-4">Avisos Recentes</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <p className="text-sm text-blue-800 font-medium">Reunião de Pais</p>
                            <p className="text-xs text-blue-600 mt-1">Sexta-feira, 14:00h</p>
                        </div>
                        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100">
                            <p className="text-sm text-orange-800 font-medium">Feriado - Carnaval</p>
                            <p className="text-xs text-orange-600 mt-1">Escola fechada dias 12 e 13</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
