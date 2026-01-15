import { ArrowLeft, Save, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FinancialChargeForm() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/financial" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Nova Cobrança</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Aluno(a)</label>
                        <select className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-300 outline-none transition-all bg-white">
                            <option value="">Selecione o aluno...</option>
                            <option>Alice Silva</option>
                            <option>Bruno Santos</option>
                            <option>Carla Dias</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <input type="text" list="descriptions" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-300 outline-none transition-all" placeholder="Ex: Mensalidade Março" />
                        <datalist id="descriptions">
                            <option value="Mensalidade" />
                            <option value="Material Didático" />
                            <option value="Taxa de Matrícula" />
                            <option value="Uniforme" />
                        </datalist>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Valor (R$)</label>
                            <div className="relative">
                                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input type="number" step="0.01" className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-300 outline-none transition-all" placeholder="0,00" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vencimento</label>
                            <input type="date" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-300 outline-none transition-all" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento Preferencial</label>
                        <select className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-300 outline-none transition-all bg-white">
                            <option>Boleto Bancário</option>
                            <option>Pix</option>
                            <option>Em Aberto (Decidir na hora)</option>
                        </select>
                        <p className="text-xs text-gray-400 mt-1">Isso gera o código Pix ou Boleto automaticamente.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações (Opcional)</label>
                        <textarea className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-300 outline-none transition-all h-24 resize-none" placeholder="Detalhes adicionais..."></textarea>
                    </div>
                </div>

                <div className="flex justify-end mt-10 pt-6 border-t border-gray-50">
                    <button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transform hover:-translate-y-0.5 cursor-pointer">
                        <Save size={20} />
                        Gerar Cobrança
                    </button>
                </div>
            </div>
        </div>
    )
}
