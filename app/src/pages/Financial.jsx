import { useState } from 'react';
import { Plus, Search, Filter, ArrowUpCircle, ArrowDownCircle, DollarSign, Calendar, MoreHorizontal, Copy, QrCode, MessageCircle, Mail, RefreshCw, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_INVOICES = [
    { id: 1, student: 'Alice Silva', description: 'Mensalidade Março/2026', amount: 850.00, dueDate: '2026-03-10', status: 'paid' },
    { id: 2, student: 'Bruno Santos', description: 'Mensalidade Março/2026', amount: 850.00, dueDate: '2026-03-10', status: 'pending' },
    { id: 3, student: 'Carla Dias', description: 'Material Didático', amount: 250.00, dueDate: '2026-03-05', status: 'overdue' },
    { id: 4, student: 'Daniel Oliveira', description: 'Mensalidade Março/2026', amount: 850.00, dueDate: '2026-03-10', status: 'pending' },
];

export default function Financial() {
    const [activeTab, setActiveTab] = useState('income'); // income | expense
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'overdue': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'paid': return 'Pago';
            case 'pending': return 'Pendente';
            case 'overdue': return 'Atrasado';
            default: return status;
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Financeiro</h1>
                    <p className="text-gray-500">Controle de mensalidades e despesas</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => alert('Funcionalidade de Nova Despesa em desenvolvimento.\nSerá similar à de Cobrança.')}
                        className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <ArrowDownCircle size={20} className="text-red-500" />
                        Nova Despesa
                    </button>
                    <Link
                        to="/financial/new-charge"
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm shadow-green-600/20"
                    >
                        <Plus size={20} />
                        Nova Cobrança
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                        <ArrowUpCircle size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Recebidos (Mês)</p>
                        <h3 className="text-2xl font-bold text-gray-800">R$ 12.450,00</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">A Receber</p>
                        <h3 className="text-2xl font-bold text-gray-800">R$ 5.800,00</h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Em Atraso</p>
                        <h3 className="text-2xl font-bold text-gray-800">R$ 850,00</h3>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-100 flex">
                    <button
                        className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'income' ? 'border-green-500 text-green-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('income')}
                    >
                        Receitas / Cobranças
                    </button>
                    <button
                        className={`flex-1 py-4 text-sm font-medium text-center border-b-2 transition-colors ${activeTab === 'expense' ? 'border-red-500 text-red-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('expense')}
                    >
                        Despesas
                    </button>
                </div>

                {/* Filters */}
                <div className="p-4 border-b border-gray-50 flex flex-col md:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por aluno ou descrição..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-100 transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center gap-2 text-gray-500 hover:text-gray-700 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors">
                        <Filter size={18} />
                        Filtrar Status
                    </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    {activeTab === 'income' ? (
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                    <th className="p-4 font-semibold">Aluno</th>
                                    <th className="p-4 font-semibold">Descrição</th>
                                    <th className="p-4 font-semibold">Vencimento</th>
                                    <th className="p-4 font-semibold">Valor</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold text-right">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {MOCK_INVOICES.map(inv => (
                                    <tr key={inv.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4 font-medium text-gray-900">{inv.student}</td>
                                        <td className="p-4 text-gray-600">{inv.description}</td>
                                        <td className="p-4 text-gray-600">{new Date(inv.dueDate).toLocaleDateString()}</td>
                                        <td className="p-4 font-medium text-gray-900">R$ {inv.amount.toFixed(2)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(inv.status)}`}>
                                                {getStatusLabel(inv.status)}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {inv.status === 'pending' ? (
                                                    <>
                                                        <button
                                                            onClick={() => alert('Link Pix copiado para a área de transferência! 📋')}
                                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                            title="Copiar Link Pix"
                                                        >
                                                            <Copy size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => alert('Abrindo QR Code e Detalhes do Pix... 📱')}
                                                            className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors border border-transparent hover:border-purple-100"
                                                            title="Detalhes / QR Code"
                                                        >
                                                            <QrCode size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => window.open('https://wa.me/?text=Olá, segue o link de pagamento: https://pix.example.com/123', '_blank')}
                                                            className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                                                            title="Enviar por WhatsApp"
                                                        >
                                                            <MessageCircle size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => alert('Email de cobrança enviado! ✉️')}
                                                            className="p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-transparent hover:border-orange-100"
                                                            title="Enviar por Email"
                                                        >
                                                            <Mail size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => alert('Atualizando status junto ao banco... 🔄')}
                                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                            title="Consultar Situação"
                                                        >
                                                            <RefreshCw size={16} />
                                                        </button>
                                                        <button
                                                            onClick={() => confirm('Tem certeza que deseja cancelar esta cobrança?') && alert('Cobrança cancelada.')}
                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                            title="Cancelar Cobrança"
                                                        >
                                                            <X size={16} />
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="text-xs text-gray-400 italic px-2">Concluído</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-10 text-center text-gray-400">
                            <p>Módulo de Despesas em breve...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
