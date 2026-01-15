import { useState } from 'react';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function StaffForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cpf: '',
        birth_date: '',
        role: '',
        phone: '',
        email: '',
        status: 'active'
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
                .from('staff')
                .insert(formData);

            if (error) throw error;

            alert('Funcionário cadastrado com sucesso!');
            navigate('/staff');
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar funcionário: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/staff" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Novo Funcionário</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                    Dados Pessoais
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all"
                            placeholder="Ex: Maria da Silva"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                        <input
                            type="text"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all"
                            placeholder="000.000.000-00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                        <input
                            type="date"
                            name="birth_date"
                            value={formData.birth_date}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all"
                        />
                    </div>
                </div>

                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                    Cargo e Contato
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Cargo / Função</label>
                        <select
                            name="role"
                            required
                            value={formData.role}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all bg-white"
                        >
                            <option value="">Selecione...</option>
                            <option value="Professora">Professora</option>
                            <option value="Monitora">Monitora</option>
                            <option value="Recreador(a)">Recreador(a)</option>
                            <option value="Gerente">Gerente</option>
                            <option value="Auxiliar de Limpeza">Auxiliar de Limpeza</option>
                            <option value="Cozinheira">Cozinheira</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all bg-white"
                        >
                            <option value="active">Ativo</option>
                            <option value="vacation">Férias</option>
                            <option value="inactive">Inativo</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all"
                            placeholder="(00) 00000-0000"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all"
                            placeholder="email@exemplo.com"
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
                        {loading ? 'Salvando...' : 'Salvar Funcionário'}
                    </button>
                </div>
            </form>
        </div>
    );
}
