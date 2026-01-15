import { useState } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ClassForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        shift: 'morning',
        capacity: 20
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase
                .from('classes')
                .insert({
                    name: formData.name,
                    shift: formData.shift,
                    capacity: parseInt(formData.capacity)
                });

            if (error) throw error;

            alert('Turma cadastrada com sucesso!');
            navigate('/classes');
        } catch (error) {
            console.error('Erro ao criar turma:', error);
            alert('Erro ao criar turma: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/classes" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Nova Turma</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Turma</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all"
                            placeholder="Ex: Berçário II"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                            <select
                                name="shift"
                                value={formData.shift}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all bg-white"
                            >
                                <option value="morning">Matutino</option>
                                <option value="afternoon">Vespertino</option>
                                <option value="full_time">Integral</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade Máxima</label>
                            <input
                                type="number"
                                name="capacity"
                                required
                                min="1"
                                value={formData.capacity}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all"
                                placeholder="Ex: 15"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Professor(a) Responsável</label>
                        <select disabled className="w-full p-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed">
                            <option value="">Selecione um funcionário...</option>
                        </select>
                        <p className="text-xs text-gray-400 mt-1">Gestão de funcionários em breve.</p>
                    </div>
                </div>

                <div className="flex justify-end mt-10 pt-6 border-t border-gray-50">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transform hover:-translate-y-0.5 cursor-pointer"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {loading ? 'Salvando...' : 'Salvar Turma'}
                    </button>
                </div>
            </form>
        </div>
    )
}
