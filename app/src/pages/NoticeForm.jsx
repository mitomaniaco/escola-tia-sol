import { useState, useEffect } from 'react';
import { ArrowLeft, Send, Users, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function NoticeForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [audienceType, setAudienceType] = useState('all'); // 'all' or 'class'

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        class_id: '',
        priority: false // true = urgent
    });

    useEffect(() => {
        const fetchClasses = async () => {
            const { data } = await supabase.from('classes').select('id, name').order('name');
            setClasses(data || []);
        };
        fetchClasses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                title: formData.title,
                content: formData.content,
                target_audience: audienceType,
                priority: formData.priority ? 'urgent' : 'normal',
                target_class_id: audienceType === 'class' ? formData.class_id : null
            };

            const { error } = await supabase
                .from('notices')
                .insert(payload);

            if (error) throw error;

            alert('Aviso enviado com sucesso!');
            navigate('/notices');
        } catch (error) {
            console.error('Erro ao enviar aviso:', error);
            alert('Erro ao enviar aviso: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/notices" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Novo Aviso</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título do Aviso</label>
                        <input
                            type="text"
                            required
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all"
                            placeholder="Ex: Reunião de Pais"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Público Alvo</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${audienceType === 'all' ? 'bg-purple-50 border-purple-200' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input
                                    type="radio"
                                    name="audience"
                                    className="text-purple-600 focus:ring-purple-500"
                                    checked={audienceType === 'all'}
                                    onChange={() => setAudienceType('all')}
                                />
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${audienceType === 'all' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}><Users size={16} /></div>
                                    <span className="font-medium text-gray-700">Toda a Escola</span>
                                </div>
                            </label>
                            <label className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${audienceType === 'class' ? 'bg-purple-50 border-purple-200' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input
                                    type="radio"
                                    name="audience"
                                    className="text-purple-600 focus:ring-purple-500"
                                    checked={audienceType === 'class'}
                                    onChange={() => setAudienceType('class')}
                                />
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full ${audienceType === 'class' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600'}`}><Users size={16} /></div>
                                    <span className="font-medium text-gray-700">Turma Específica</span>
                                </div>
                            </label>
                        </div>

                        {audienceType === 'class' && (
                            <select
                                className="mt-3 w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all bg-white animate-in fade-in slide-in-from-top-2"
                                value={formData.class_id}
                                onChange={e => setFormData({...formData, class_id: e.target.value})}
                                required={audienceType === 'class'}
                            >
                                <option value="">Selecione a turma...</option>
                                {classes.map(cls => (
                                    <option key={cls.id} value={cls.id}>{cls.name}</option>
                                ))}
                            </select>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                        <textarea
                            required
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all h-40 resize-none"
                            placeholder="Digite o conteúdo do aviso..."
                            value={formData.content}
                            onChange={e => setFormData({...formData, content: e.target.value})}
                        ></textarea>
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="urgent"
                            className="text-red-500 focus:ring-red-500 rounded"
                            checked={formData.priority}
                            onChange={e => setFormData({...formData, priority: e.target.checked})}
                        />
                        <label htmlFor="urgent" className="text-sm text-gray-700 font-medium cursor-pointer">Marcar como Importante / Urgente</label>
                    </div>
                </div>

                <div className="flex justify-end mt-10 pt-6 border-t border-gray-50">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transform hover:-translate-y-0.5 cursor-pointer"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                        {loading ? 'Enviando...' : 'Enviar Aviso'}
                    </button>
                </div>
            </form>
        </div>
    )
}
