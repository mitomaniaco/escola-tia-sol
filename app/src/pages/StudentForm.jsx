import { useState, useEffect } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function StudentForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [classes, setClasses] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        birth_date: '',
        class_id: '',
        guardian_name: '',
        guardian_phone: '',
        guardian_address: '',
        guardian_email: ''
    });

    useEffect(() => {
        // Carrega turmas para o select
        const fetchClasses = async () => {
            const { data } = await supabase.from('classes').select('id, name, shift').order('name');
            setClasses(data || []);
        };
        fetchClasses();
    }, []);

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
            // 1. Criar Responsável
            const { data: guardian, error: guardianError } = await supabase
                .from('guardians')
                .insert({
                    name: formData.guardian_name,
                    phone: formData.guardian_phone,
                    address: formData.guardian_address,
                    email: formData.guardian_email || null
                })
                .select()
                .single();

            if (guardianError) throw new Error(`Erro ao criar responsável: ${guardianError.message}`);

            // 2. Criar Aluno (agora com class_id)
            const { data: student, error: studentError } = await supabase
                .from('students')
                .insert({
                    name: formData.name,
                    birth_date: formData.birth_date,
                    enrollment_status: 'active',
                    class_id: formData.class_id || null
                })
                .select()
                .single();

            if (studentError) throw new Error(`Erro ao criar aluno: ${studentError.message}`);

            // 3. Vincular (Pivot)
            const { error: linkError } = await supabase
                .from('student_guardians')
                .insert({
                    student_id: student.id,
                    guardian_id: guardian.id,
                    relationship_type: 'financial_responsible', // Default
                    is_financial_responsible: true
                });

            if (linkError) throw new Error(`Erro ao vincular: ${linkError.message}`);

            alert('Matrícula realizada com sucesso!');
            navigate('/students');

        } catch (error) {
            console.error(error);
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const translateShift = (shift) => {
        const map = { 'morning': 'Matutino', 'afternoon': 'Vespertino', 'full_time': 'Integral' };
        return map[shift] || shift;
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/students" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Nova Matrícula</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                    Dados do Aluno
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all"
                            placeholder="Ex: Joãozinho Silva"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                        <input
                            type="date"
                            name="birth_date"
                            required
                            value={formData.birth_date}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Turma (Opcional)</label>
                        <select
                            name="class_id"
                            value={formData.class_id}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all bg-white"
                        >
                            <option value="">Selecione uma turma...</option>
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name} ({translateShift(cls.shift)})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2 mt-8">
                    <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                    Responsável Financeiro
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável</label>
                        <input
                            type="text"
                            name="guardian_name"
                            required
                            value={formData.guardian_name}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                        <input
                            type="tel"
                            name="guardian_phone"
                            required
                            value={formData.guardian_phone}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all"
                            placeholder="(00) 00000-0000"
                        />
                    </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email (Opcional)</label>
                        <input
                            type="email"
                            name="guardian_email"
                            value={formData.guardian_email}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all"
                            placeholder="email@exemplo.com"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                        <input
                            type="text"
                            name="guardian_address"
                            value={formData.guardian_address}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all"
                            placeholder="Rua, Número, Bairro, Cidade - CEP"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-10 pt-6 border-t border-gray-50">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transform hover:-translate-y-0.5 cursor-pointer"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {loading ? 'Salvando...' : 'Salvar Matrícula'}
                    </button>
                </div>
            </form>
        </div>
    );
}
