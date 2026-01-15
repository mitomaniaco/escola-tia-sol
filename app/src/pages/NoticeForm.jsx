import { ArrowLeft, Send, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NoticeForm() {
    const handleSend = () => {
        alert('Aviso enviado com sucesso! (Simulação)\n\nTodos os responsáveis receberão uma notificação no app.');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/notices" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Novo Aviso</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Título do Aviso</label>
                        <input type="text" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all" placeholder="Ex: Reunião de Pais" />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Público Alvo</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input type="radio" name="audience" className="text-purple-600 focus:ring-purple-500" defaultChecked />
                                <div className="flex items-center gap-3">
                                    <div className="bg-purple-100 p-2 rounded-full text-purple-600"><Users size={16} /></div>
                                    <span className="font-medium text-gray-700">Toda a Escola</span>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                <input type="radio" name="audience" className="text-purple-600 focus:ring-purple-500" />
                                <div className="flex items-center gap-3">
                                    <div className="bg-gray-100 p-2 rounded-full text-gray-600"><Users size={16} /></div>
                                    <span className="font-medium text-gray-700">Turma Específica</span>
                                </div>
                            </label>
                        </div>
                        <select className="mt-3 w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all bg-white hidden">
                            <option value="">Selecione a turma...</option>
                            <option>Berçário I</option>
                            <option>Jardim I</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Mensagem</label>
                        <textarea className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all h-40 resize-none" placeholder="Digite o conteúdo do aviso..."></textarea>
                    </div>

                    <div className="flex items-center gap-2">
                        <input type="checkbox" id="urgent" className="text-red-500 focus:ring-red-500 rounded" />
                        <label htmlFor="urgent" className="text-sm text-gray-700 font-medium">Marcar como Importante / Urgente</label>
                    </div>
                </div>

                <div className="flex justify-end mt-10 pt-6 border-t border-gray-50">
                    <button
                        onClick={handleSend}
                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transform hover:-translate-y-0.5 cursor-pointer"
                    >
                        <Send size={20} />
                        Enviar Aviso
                    </button>
                </div>
            </div>
        </div>
    )
}
