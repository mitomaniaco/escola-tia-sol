import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { Utensils, Moon, Smile, Calendar, AlertCircle, ChevronRight, Loader2, Camera, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function PortalDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [student, setStudent] = useState(null);
    const [logs, setLogs] = useState([]);
    const [viewPhoto, setViewPhoto] = useState(null);

    useEffect(() => {
        if (user?.email) {
            fetchStudentData();
        }
    }, [user]);

    const fetchStudentData = async () => {
        try {
            setLoading(true);

            // 1. Encontrar o ID do Responsável pelo email
            const { data: guardian } = await supabase
                .from('guardians')
                .select('id')
                .eq('email', user.email)
                .single();

            if (!guardian) {
                setLoading(false);
                return;
            }

            // 2. Encontrar o Aluno vinculado
            const { data: relation } = await supabase
                .from('student_guardians')
                .select('student_id, students(*)')
                .eq('guardian_id', guardian.id)
                .single(); // MVP: Pega o primeiro aluno. Futuro: Seletor de alunos

            if (relation?.students) {
                setStudent(relation.students);
                fetchDailyLogs(relation.students.id);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchDailyLogs = async (studentId) => {
        const today = new Date().toISOString().split('T')[0];
        const { data } = await supabase
            .from('daily_logs')
            .select('*')
            .eq('student_id', studentId)
            .eq('date', today)
            .order('created_at', { ascending: false });

        setLogs(data || []);
    };

    if (loading) {
        return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-orange-500" /></div>;
    }

    if (!student) {
        return (
            <div className="text-center py-10">
                <div className="bg-orange-50 p-6 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center text-orange-500">
                    <Smile size={32} />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Bem-vindo!</h2>
                <p className="text-gray-500 mt-2 px-6">Seu cadastro está ativo, mas ainda não encontramos o vínculo com o aluno. Entre em contato com a secretaria.</p>
            </div>
        );
    }

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
            {/* Modal de Foto */}
            {viewPhoto && (
                <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in" onClick={() => setViewPhoto(null)}>
                    <button className="absolute top-4 right-4 text-white hover:text-gray-300">
                        <X size={32} />
                    </button>
                    <img src={viewPhoto} alt="Atividade" className="max-w-full max-h-[90vh] rounded-lg" />
                </div>
            )}

            {/* Student Card */}
            <div className="bg-gradient-to-r from-orange-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-500/20">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full border-4 border-white/30 bg-white/20 flex items-center justify-center text-2xl font-bold">
                        {student.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{student.name}</h2>
                        <p className="text-white/80 text-sm flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                        </p>
                    </div>
                </div>
            </div>

            {/* Avisos Importantes (Mock por enquanto) */}
            {/* <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="text-blue-500 shrink-0 mt-0.5" size={20} />
                <div>
                    <h3 className="font-bold text-blue-800 text-sm">Festa Junina</h3>
                    <p className="text-xs text-blue-600 mt-1">Lembrete: A festa será neste sábado. Trazer prato de doce ou salgado.</p>
                </div>
            </div> */}

            {/* Timeline */}
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-gray-800 text-lg">Agenda de Hoje</h3>
                    <Link to="/portal/diary" className="text-xs font-bold text-orange-600 flex items-center gap-1">
                        Ver histórico <ChevronRight size={14} />
                    </Link>
                </div>

                {logs.length === 0 ? (
                    <div className="text-center py-8 bg-white rounded-xl border border-gray-100">
                        <p className="text-gray-400 text-sm">Nenhuma atividade registrada hoje ainda.</p>
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
                                        <div className="mt-3">
                                            <button
                                                onClick={() => setViewPhoto(log.photo_url)}
                                                className="relative w-full h-32 rounded-lg overflow-hidden group"
                                            >
                                                <img src={log.photo_url} className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                    <Camera className="text-white drop-shadow-md" />
                                                </div>
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
