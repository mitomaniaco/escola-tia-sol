import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ClassForm() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/classes" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Nova Turma</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Turma</label>
                        <input type="text" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all" placeholder="Ex: Berçário II" />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
                            <select className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all bg-white">
                                <option>Matutino</option>
                                <option>Vespertino</option>
                                <option>Integral</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacidade Máxima</label>
                            <input type="number" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all" placeholder="Ex: 15" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Professor(a) Responsável</label>
                        <select className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all bg-white">
                            <option value="">Selecione um funcionário...</option>
                            <option>Tia Ana</option>
                            <option>Tia Ju</option>
                            <option>Tio Leo</option>
                        </select>
                        <p className="text-xs text-gray-400 mt-1">Cadastre funcionários primeiro para aparecerem aqui.</p>
                    </div>
                </div>

                <div className="flex justify-end mt-10 pt-6 border-t border-gray-50">
                    <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transform hover:-translate-y-0.5 cursor-pointer">
                        <Save size={20} />
                        Salvar Turma
                    </button>
                </div>
            </div>
        </div>
    )
}
