import { ArrowLeft, Save, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function GuardianForm() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/guardians" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Novo Responsável</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Dados Pessoais
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input type="text" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" placeholder="Ex: João da Silva" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CPF</label>
                        <input type="text" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" placeholder="000.000.000-00" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">RG</label>
                        <input type="text" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" />
                    </div>
                </div>

                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Contato e Endereço
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Celular / WhatsApp</label>
                        <input type="tel" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" placeholder="(00) 00000-0000" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input type="email" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" placeholder="email@exemplo.com" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                        <input type="text" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all" placeholder="Rua, Número, Bairro, Cidade - UF" />
                    </div>
                </div>

                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                    Alunos Vinculados
                </h2>

                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 border-dashed text-center">
                    <p className="text-sm text-gray-500 mb-3">Nenhum aluno vinculado a este responsável.</p>
                    <button className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium hover:text-blue-700">
                        <Plus size={16} />
                        Vincular Aluno Existente
                    </button>
                </div>

                <div className="flex justify-end mt-10 pt-6 border-t border-gray-50">
                    <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transform hover:-translate-y-0.5 cursor-pointer">
                        <Save size={20} />
                        Salvar Responsável
                    </button>
                </div>
            </div>
        </div>
    )
}
