import { useState, useEffect } from 'react';
import { Plus, Calendar, Search, Smile, Utensils, Moon, Loader2, Droplets, Book, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

export default function Pedagogical() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ lunch: 0, nap: 0, mood: 'N/A' });

    useEffect(() => {
        fetchLogs();
    }, [date]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('daily_logs')
                .select(`
                    *,
                    students (name)
                `)
                .eq('date', date)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setLogs(data || []);
            calculateStats(data || []);
        } catch (error) {
            console.error('Erro ao buscar diário:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (data) => {
        const lunchCount = data.filter(l => l.type === 'lunch' || l.type === 'snack').length;
        const napCount = data.filter(l => l.type === 'nap').length;
        // Lógica simples para humor predominante (pode ser melhorada)
        const moodCount = data.filter(l => l.type === 'mood').length;

        setStats({
            lunch: lunchCount,
            nap: napCount,
            mood: moodCount > 0 ? 'Registrado' : 'Pendente'
        });
    };

    const handleDelete = async (id) => {
        if(!confirm('Excluir este registro?')) return;
        try {
            const { error } = await supabase.from('daily_logs').delete().eq('id', id);
            if(error) throw error;
            fetchLogs();
        } catch (err) {
            alert('Erro ao excluir');
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'lunch':
            case 'snack': return <Utensils size={16} />;
            case 'nap': return <Moon size={16} />;
            case 'mood': return <Smile size={16} />;
            case 'hygiene': return <Droplets size={16} />;
            case 'education': return <Book size={16} />;
            default: return <Calendar size={16} />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'lunch':
            case 'snack': return 'bg-orange-100 text-orange-600';
            case 'nap': return 'bg-blue-100 text-blue-600';
            case 'mood': return 'bg-purple-100 text-purple-600';
            case 'hygiene': return 'bg-cyan-100 text-cyan-600';
            case 'education': return 'bg-green-100 text-green-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    const translateType = (type) => {
         const map = {
             lunch: 'Almoço', snack: 'Lanche', nap: 'Soneca',
             mood: 'Comportamento', hygiene: 'Higiene', education: 'Atividade'
         };
         return map[type] || type;
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Diário de Classe</h1>
                    <p className="text-gray-500">Registro de atividades e rotina</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm flex-1 md:flex-none">
                        <Calendar size={20} className="text-gray-400 ml-2" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="outline-none text-gray-700 font-medium w-full"
                        />
                    </div>
                    <Link
                        to="/pedagogical/new-entry"
                        className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm shadow-purple-600/20"
                    >
                        <Plus size={20} />
                        <span className="md:hidden">Novo</span>
                        <span className="hidden md:inline">Novo Registro</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Summary Cards - Mobile Optimized Grid */}
                <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs md:text-sm">Refeições</p>
                            <h4 className="font-bold text-lg text-gray-800">{stats.lunch} <span className="text-xs font-normal text-gray-400">regs</span></h4>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                            <Utensils size={18} />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs md:text-sm">Soneca</p>
                            <h4 className="font-bold text-lg text-gray-800">{stats.nap} <span className="text-xs font-normal text-gray-400">regs</span></h4>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Moon size={18} />
                        </div>
                    </div>
                    <div className="col-span-2 md:col-span-1 bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-xs md:text-sm">Humor Geral</p>
                            <h4 className="font-bold text-lg text-green-600">{stats.mood}</h4>
                        </div>
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                            <Smile size={18} />
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4 md:p-6">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                        Linha do Tempo
                    </h3>

                    {loading ? (
                        <div className="py-10 flex justify-center text-purple-500">
                            <Loader2 className="animate-spin" size={32} />
                        </div>
                    ) : logs.length === 0 ? (
                        <div className="py-10 text-center text-gray-400 bg-gray-50 rounded-lg border-2 border-dashed border-gray-100">
                            <p>Nenhuma atividade registrada hoje.</p>
                            <Link to="/pedagogical/new-entry" className="text-purple-600 font-medium hover:underline mt-2 inline-block">
                                Registrar primeira atividade
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4 md:space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100">
                            {logs.map(log => (
                                <div key={log.id} className="relative pl-8 group">
                                    <div className={`absolute left-0 top-0 w-4 h-4 rounded-full border-2 border-white ring-2 ring-gray-100 ${getActivityColor(log.type).replace('text-', 'bg-').split(' ')[0]}`}></div>
                                    <div className="bg-gray-50 rounded-lg p-3 md:p-4 transition-all hover:bg-white hover:shadow-md border border-gray-100 hover:border-purple-100">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="flex flex-wrap items-center gap-2 font-bold text-gray-800 text-sm md:text-base">
                                                {log.students?.name || 'Aluno Removido'}
                                                <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getActivityColor(log.type)}`}>
                                                    {getActivityIcon(log.type)} {translateType(log.type)}
                                                </span>
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-400 font-medium">
                                                    {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                                </span>
                                                <button
                                                    onClick={() => handleDelete(log.id)}
                                                    className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity p-1"
                                                    title="Excluir"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 text-sm">{log.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick List (Pode ser melhorado futuramente para mostrar quem falta) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit hidden lg:block">
                    <h3 className="font-bold text-gray-800 mb-4 text-sm uppercase tracking-wide">Dica Rápida</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm text-blue-800">
                        <p>Use o aplicativo no celular para registrar atividades diretamente da sala de aula. A interface foi otimizada para toque!</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
