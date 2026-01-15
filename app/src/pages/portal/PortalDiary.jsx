import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Utensils, Moon, Smile, Calendar, Loader2 } from 'lucide-react';

export default function PortalDiary() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [logs, setLogs] = useState([]);
    const [studentId, setStudentId] = useState(null);

    useEffect(() => {
        // Busca ID do aluno primeiro
        const fetchStudent = async () => {
            const { data: guardian } = await supabase.from('guardians').select('id').eq('email', user.email).single();
            if (guardian) {
                const { data: relation } = await supabase.from('student_guardians').select('student_id').eq('guardian_id', guardian.id).single();
                if (relation) setStudentId(relation.student_id);
            }
        };
        if (user?.email) fetchStudent();
    }, [user]);

    useEffect(() => {
        if (studentId) fetchLogs();
    }, [studentId, date]);

    const fetchLogs = async () => {
        try {
            setLoading(true);
            const { data } = await supabase
                .from('daily_logs')
                .select('*')
                .eq('student_id', studentId)
                .eq('date', date)
                .order('created_at', { ascending: false });
            setLogs(data || []);
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'lunch': return <Utensils size={18} />;
            case 'snack': return <Utensils size={18} />;
            case 'nap': return <Moon size={18} />;
            default: return <Smile size={18} />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'lunch':
            case 'snack': return 'bg-orange-100 text-orange-600';
            case 'nap': return 'bg-blue-100 text-blue-600';
            default: return 'bg-purple-100 text-purple-600';
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Diário Escolar</h2>

            <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <Calendar size={20} className="text-gray-400" />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="outline-none text-gray-700 font-medium w-full bg-transparent"
                />
            </div>

            {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-purple-500" /></div>
            ) : logs.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-400">Nenhum registro encontrado para esta data.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {logs.map(log => (
                        <div key={log.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getActivityColor(log.type)}`}>
                                {getActivityIcon(log.type)}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-800 text-sm capitalize">{log.type === 'lunch' ? 'Almoço' : log.type}</h4>
                                    <span className="text-xs text-gray-400 font-medium">
                                        {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </span>
                                </div>
                                <p className="text-gray-600 text-sm mt-1">{log.description}</p>
                                {log.photo_url && (
                                    <img src={log.photo_url} className="mt-3 rounded-lg w-full h-40 object-cover" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
