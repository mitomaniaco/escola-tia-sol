import { ArrowLeft, Save, Coffee, Moon, Smile, Droplets, Book, Loader2, Camera, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function ActivityForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);
    const [photo, setPhoto] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [formData, setFormData] = useState({
        student_id: '',
        type: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    useEffect(() => {
        const fetchStudents = async () => {
            const { data } = await supabase.from('students').select('id, name').order('name');
            setStudents(data || []);
        };
        fetchStudents();
    }, []);

    const activityTypes = [
        { id: 'lunch', label: 'Almoço', icon: Coffee, color: 'orange' },
        { id: 'snack', label: 'Lanche', icon: Coffee, color: 'yellow' },
        { id: 'sleep', label: 'Sono', icon: Moon, color: 'blue' },
        { id: 'hygiene', label: 'Higiene', icon: Droplets, color: 'cyan' },
        { id: 'education', label: 'Atividade', icon: Book, color: 'green' },
        { id: 'mood', label: 'Humor', icon: Smile, color: 'purple' },
    ];

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPhoto(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removePhoto = () => {
        setPhoto(null);
        setPreviewUrl(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.student_id || !formData.type) {
            alert('Selecione um aluno e um tipo de atividade');
            return;
        }

        try {
            setLoading(true);
            let photoUrl = null;

            // 1. Upload da Foto (se houver)
            if (photo) {
                const fileExt = photo.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
                const filePath = `${formData.student_id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('activity-photos')
                    .upload(filePath, photo);

                if (uploadError) throw new Error(`Erro no upload: ${uploadError.message}`);

                const { data: { publicUrl } } = supabase.storage
                    .from('activity-photos')
                    .getPublicUrl(filePath);

                photoUrl = publicUrl;
            }

            // 2. Salvar Registro
            const { error } = await supabase
                .from('daily_logs')
                .insert({
                    student_id: formData.student_id,
                    type: formData.type,
                    description: formData.description,
                    date: formData.date,
                    status: 'good',
                    photo_url: photoUrl
                });

            if (error) throw error;

            alert('Atividade registrada com sucesso!');
            navigate('/pedagogical');
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao salvar: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/pedagogical" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Novo Registro</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">

                <div className="space-y-8">
                    {/* Student Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Para quem é este registro?</label>
                        <select
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all bg-white text-lg"
                            value={formData.student_id}
                            onChange={e => setFormData({...formData, student_id: e.target.value})}
                            required
                        >
                            <option value="">Selecione o aluno...</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Activity Type Grid */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Atividade</label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                            {activityTypes.map(type => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setFormData({...formData, type: type.id})}
                                    className={`flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all h-24 ${formData.type === type.id
                                            ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700 ring-2 ring-${type.color}-200 shadow-md`
                                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <type.icon size={24} />
                                    <span className="text-xs font-medium">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Foto da Atividade (Opcional)</label>

                        {!previewUrl ? (
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500 font-medium">Toque para adicionar foto</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
                            </label>
                        ) : (
                            <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={removePhoto}
                                    className="absolute top-2 right-2 p-1 bg-white/80 rounded-full text-gray-600 hover:text-red-500 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Details */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Detalhes / Observação</label>
                        <textarea
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all h-32 resize-none text-base"
                            placeholder="Ex: Comeu tudo, dormiu rápido..."
                            value={formData.description}
                            onChange={e => setFormData({...formData, description: e.target.value})}
                        ></textarea>
                    </div>

                    {/* Time & Date */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                            <input
                                type="date"
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all"
                                value={formData.date}
                                onChange={e => setFormData({...formData, date: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                            <input
                                type="time"
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all"
                                value={formData.time}
                                onChange={e => setFormData({...formData, time: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-10 pt-6 border-t border-gray-50">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transform hover:-translate-y-0.5 cursor-pointer w-full md:w-auto justify-center"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {loading ? 'Salvando...' : 'Salvar Registro'}
                    </button>
                </div>
            </form>
        </div>
    )
}
