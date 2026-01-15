import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Bell, AlertTriangle, Loader2 } from 'lucide-react';

export default function PortalNotices() {
    const [loading, setLoading] = useState(true);
    const [notices, setNotices] = useState([]);

    useEffect(() => {
        fetchNotices();
    }, []);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            // MVP: Busca todos os avisos públicos. Futuro: Filtrar por turma do aluno.
            const { data } = await supabase
                .from('notices')
                .select('*')
                .or(`target_audience.eq.all,target_audience.eq.guardians`)
                .order('created_at', { ascending: false });

            setNotices(data || []);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Mural de Avisos</h2>

            {loading ? (
                <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : notices.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-xl">
                    <p className="text-gray-400">Nenhum aviso no momento.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {notices.map(notice => (
                        <div key={notice.id} className={`p-5 rounded-xl border ${
                            notice.priority === 'urgent' ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 shadow-sm'
                        }`}>
                            <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full shrink-0 ${
                                    notice.priority === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                    {notice.priority === 'urgent' ? <AlertTriangle size={20} /> : <Bell size={20} />}
                                </div>
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-bold ${notice.priority === 'urgent' ? 'text-red-800' : 'text-gray-800'}`}>
                                            {notice.title}
                                        </h3>
                                        <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                                            {new Date(notice.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className={`text-sm mt-1 ${notice.priority === 'urgent' ? 'text-red-700' : 'text-gray-600'}`}>
                                        {notice.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
