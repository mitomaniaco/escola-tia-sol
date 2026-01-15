import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentForm() {
    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/students" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Nova Matrícula</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2">
                    <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                    Dados do Aluno
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                        <input type="text" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all" placeholder="Ex: Joãozinho Silva" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                        <input type="date" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all" />
                    </div>
                </div>

                <h2 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-50 flex items-center gap-2 mt-8">
                    <span className="w-1 h-6 bg-orange-500 rounded-full"></span>
                    Responsáveis & Endereço
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome do Responsável</label>
                        <input type="text" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                        <input type="tel" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all" placeholder="(00) 00000-0000" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Endereço Completo</label>
                        <input type="text" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all" placeholder="Rua, Número, Bairro, Cidade - CEP" />
                    </div>
                </div>

                <div className="flex justify-end mt-10 pt-6 border-t border-gray-50">
                    <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transform hover:-translate-y-0.5 cursor-pointer">
                        <Save size={20} />
                        Salvar Matrícula
                    </button>
                </div>
            </div>
        </div>
    )
}
