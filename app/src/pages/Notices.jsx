import { useState } from 'react';
import { Plus, Search, Bell, Users, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_NOTICES = [
    { id: 1, title: 'Reunião de Pais e Mestres', content: 'A reunião ocorrerá na próxima sexta, 19h.', audience: 'Todos', date: '2026-03-15', type: 'general' },
    { id: 2, title: 'Passeio ao Zoológico', content: 'Lembrar de enviar autorização assinada.', audience: 'Jardim I', date: '2026-03-20', type: 'class' },
    { id: 3, title: 'Caso de Varicela', content: 'Tivemos um caso confirmado no Berçário, fiquem atentos.', audience: 'Berçário I', date: '2026-03-10', type: 'urgent' },
];

export default function Notices() {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = MOCK_NOTICES.filter(n =>
        n.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        n.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja excluir este aviso?')) {
            alert('Aviso excluído com sucesso (Simulação)');
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Mural de Avisos</h1>
                    <p className="text-gray-500">Comunicação geral com pais e alunos</p>
                </div>
                <Link
                    to="/notices/new"
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm shadow-purple-600/20"
                >
                    <Plus size={20} />
                    Novo Aviso
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar avisos..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100 transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="divide-y divide-gray-50">
                    {filtered.map(notice => (
                        <div key={notice.id} className="p-6 hover:bg-gray-50 transition-colors flex gap-4 items-start group">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${notice.type === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-purple-100 text-purple-600'
                                }`}>
                                <Bell size={24} />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-800 text-lg">{notice.title}</h3>
                                    <span className="text-xs text-gray-400">{new Date(notice.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-600 mb-3">{notice.content}</p>
                                <div className="flex items-center gap-4">
                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                        <Users size={12} />
                                        {notice.audience}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDelete(notice.id)}
                                className="p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                title="Excluir"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
