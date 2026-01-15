import { useState } from 'react';
import { Plus, Search, MoreHorizontal, User, Users, X, Save, Trash2, Edit } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_GUARDIANS = [
    { id: 1, name: 'Ademir Bernadino dos Reis', students: ['Davi Lucas Silva'], relation: 'Pai', phone: '(11) 99999-0001' },
    { id: 2, name: 'Ana Lucia Ferreira', students: ['Pedro Antônio', 'Maria Júlia'], relation: 'Mãe', phone: '(11) 99999-0002' },
    { id: 3, name: 'Beatriz Cristina Assunção', students: ['Ana Clara Assunção'], relation: 'Mãe', phone: '(11) 99999-0003' },
    { id: 4, name: 'Bruno André Barucci', students: ['Valentina Lisboa'], relation: 'Pai', phone: '(11) 99999-0004' },
];

export default function Guardians() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGuardian, setSelectedGuardian] = useState(null);

    const filtered = MOCK_GUARDIANS.filter(g =>
        g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        g.students.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleEdit = (guardian) => {
        setSelectedGuardian(guardian);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja remover este responsável?')) {
            alert('Responsável removido com sucesso (Simulação)');
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert('Dados atualizados com sucesso! (Simulação)');
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Responsáveis</h1>
                    <p className="text-gray-500">Gestão de pais e responsáveis financeiros</p>
                </div>
                <Link
                    to="/guardians/new"
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm shadow-orange-500/20"
                >
                    <Plus size={20} />
                    Novo Responsável
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou aluno..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                                <th className="p-4 font-semibold">Nome do Responsável</th>
                                <th className="p-4 font-semibold">Alunos Relacionados</th>
                                <th className="p-4 font-semibold">Vínculo</th>
                                <th className="p-4 font-semibold">Contato</th>
                                <th className="p-4 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(guardian => (
                                <tr key={guardian.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                <User size={16} />
                                            </div>
                                            <span className="font-medium text-gray-900">{guardian.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-wrap gap-2">
                                            {guardian.students.map((student, idx) => (
                                                <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700 border border-gray-200">
                                                    <Users size={12} />
                                                    {student}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{guardian.relation}</td>
                                    <td className="p-4 text-gray-600">{guardian.phone}</td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(guardian)}
                                                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(guardian.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {isModalOpen && selectedGuardian && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">Editar Responsável</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    defaultValue={selectedGuardian.name}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                                <input
                                    type="text"
                                    defaultValue={selectedGuardian.phone}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vínculo</label>
                                <select
                                    defaultValue={selectedGuardian.relation}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all bg-white"
                                >
                                    <option>Pai</option>
                                    <option>Mãe</option>
                                    <option>Avô/Avó</option>
                                    <option>Tio/Tia</option>
                                    <option>Outro</option>
                                </select>
                            </div>
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
                                >
                                    <Save size={18} />
                                    Salvar Alterações
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
