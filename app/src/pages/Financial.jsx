import { useState, useEffect } from 'react';
import { Plus, Search, Filter, ArrowUpCircle, ArrowDownCircle, DollarSign, Calendar, Copy, QrCode, MessageCircle, Mail, RefreshCw, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export default function Financial() {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('income'); // income | expense
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchRecords();
    }, [activeTab]);

    const fetchRecords = async () => {
        try {
            setLoading(true);

            let query = supabase
                .from('financial_records')
                .select(`
                    *,
                    students (name),
                    guardians (name)
                `)
                .eq('type', activeTab) // 'income' or 'expense'
                .order('due_date', { ascending: false });

            const { data, error } = await query;

            if (error) throw error;
            setRecords(data || []);
        } catch (error) {
            console.error('Erro ao buscar registros:', error);
            alert('Erro ao carregar dados financeiros');
        } finally {
            setLoading(false);
        }
    };

    // Cálculos para os Cards (Dashboard rápido)
    const stats = {
        received: records.filter(c => c.status === 'paid').reduce((acc, curr) => acc + Number(curr.amount), 0),
        pending: records.filter(c => c.status === 'pending').reduce((acc, curr) => acc + Number(curr.amount), 0),
        overdue: records.filter(c => c.status === 'overdue').reduce((acc, curr) => acc + Number(curr.amount), 0),
    };

    const filtered = records.filter(c => {
        const search = searchTerm.toLowerCase();
        return (
            c.title.toLowerCase().includes(search) ||
            c.description?.toLowerCase().includes(search) ||
            c.students?.name.toLowerCase().includes(search) ||
            c.guardians?.name.toLowerCase().includes(search)
        );
    });

    const handleCancel = async (id) => {
        if (!confirm('Tem certeza que deseja cancelar este registro?')) return;
        try {
            const { error } = await supabase
                .from('financial_records')
                .update({ status: 'cancelled' })
                .eq('id', id);

            if (error) throw error;
            fetchRecords(); // Recarrega
        } catch (error) {
            console.error(error);
            alert('Erro ao cancelar registro');
        }
    };

    const handleMarkAsPaid = async (id) => {
        if (!confirm('Confirmar liquidação deste registro?')) return;
        try {
            const { error } = await supabase
                .from('financial_records')
                .update({
                    status: 'paid',
                    paid_at: new Date().toISOString()
                })
                .eq('id', id);

            if (error) throw error;
            fetchRecords();
        } catch (error) {
            console.error(error);
            alert('Erro ao atualizar status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'overdue': return 'bg-red-100 text-red-700';
            case 'cancelled': return 'bg-gray-100 text-gray-500 line-through';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'paid': return 'Pago';
            case 'pending': return 'Pendente';
            case 'overdue': return 'Atrasado';
            case 'cancelled': return 'Cancelado';
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
                        <p className="text-sm text-gray-500 font-medium">Recebidos (Total)</p>
                        <h3 className="text-2xl font-bold text-gray-800">
                            R$ {stats.received.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">A Receber</p>
                        <h3 className="text-2xl font-bold text-gray-800">
                            R$ {stats.pending.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                        <Calendar size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 font-medium">Em Atraso</p>
                        <h3 className="text-2xl font-bold text-gray-800">
                            R$ {stats.overdue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </h3>
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
                                {loading ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500">
                                            <div className="flex justify-center items-center gap-2">
                                                <Loader2 className="animate-spin" /> Carregando financeiro...
                                            </div>
                                        </td>
                                    </tr>
                                ) : filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="p-8 text-center text-gray-500">
                                            Nenhuma cobrança encontrada.
                                        </td>
                                    </tr>
                                ) : (
                                    filtered.map(charge => (
                                        <tr key={charge.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4 font-medium text-gray-900">
                                                {charge.students?.name || 'Aluno Excluído'}
                                            </td>
                                            <td className="p-4 text-gray-600">{charge.title}</td>
                                            <td className="p-4 text-gray-600">{new Date(charge.due_date).toLocaleDateString()}</td>
                                            <td className="p-4 font-medium text-gray-900">
                                                R$ {Number(charge.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(charge.status)}`}>
                                                    {getStatusLabel(charge.status)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {['pending', 'overdue'].includes(charge.status) ? (
                                                        <>
                                                            <button
                                                                onClick={() => alert('Em breve: Copia Chave Pix do Asaas/Banco')}
                                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                                title="Copiar Link Pix"
                                                            >
                                                                <Copy size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => window.open(`https://wa.me/?text=Olá, segue cobrança escolar: ${charge.title} - Valor R$ ${charge.amount}`, '_blank')}
                                                                className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                                                                title="Enviar por WhatsApp"
                                                            >
                                                                <MessageCircle size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleMarkAsPaid(charge.id)}
                                                                className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                                                                title="Marcar como Pago (Manual)"
                                                            >
                                                                <RefreshCw size={16} />
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancel(charge.id)}
                                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                                                                title="Cancelar Cobrança"
                                                            >
                                                                <X size={16} />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic px-2">
                                                            {charge.status === 'cancelled' ? 'Cancelado' : 'Concluído'}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
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
