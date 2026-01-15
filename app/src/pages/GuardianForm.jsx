import { useState } from 'react';
import { ArrowLeft, Save, Loader2, Plus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function GuardianForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        cpf: '',
        rg: '', // Opcional, não tem no schema simplificado mas pode ser útil no futuro
        phone: '',
        email: '',
        address: ''
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
                .from('guardians')
                .insert({
                    name: formData.name,
                    cpf: formData.cpf,
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address
                });

            if (error) throw error;

            alert('Responsável cadastrado com sucesso!');
            navigate('/guardians');
        } catch (error) {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar responsável: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/guardians" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Novo Responsável</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
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
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                            placeholder="Ex: João da Silva"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                        <input
                            type="text"
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                            placeholder="000.000.000-00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RG (Opcional)</label>
                        <input
                            type="text"
                            name="rg"
                            value={formData.rg}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                        />
                    </div>
                </div>

                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Contato e Endereço
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Celular / WhatsApp</label>
                        <input
                            type="tel"
                            name="phone"
                            required
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
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
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                            placeholder="email@exemplo.com"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                            placeholder="Rua, Número, Bairro, Cidade - UF"
                        />
                    </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 border-dashed text-center">
                    <p className="text-sm text-gray-500 mb-3">Para vincular alunos, utilize a tela de Edição do Aluno ou faça uma nova Matrícula.</p>
                </div>

                <div className="flex justify-end mt-10 pt-6 border-t border-gray-50">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transform hover:-translate-y-0.5 cursor-pointer"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {loading ? 'Salvando...' : 'Salvar Responsável'}
                    </button>
                </div>
            </form>
        </div>
    )
}
