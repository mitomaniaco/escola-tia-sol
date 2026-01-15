import { useState } from 'react';
import { Plus, Search, MoreHorizontal, User, Edit, Trash2, X, Save } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_STUDENTS = [
    { id: 1, name: 'Alice Silva', age: 3, guardian: 'Mariana Silva', status: 'active' },
    { id: 2, name: 'Bruno Santos', age: 4, guardian: 'Roberto Santos', status: 'active' },
    { id: 3, name: 'Carla Dias', age: 2, guardian: 'Fernanda Dias', status: 'inactive' },
];

export default function Students() {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    const filtered = MOCK_STUDENTS.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.guardian.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (confirm('Tem certeza que deseja desativar este aluno?')) {
            alert('Aluno desativado com sucesso (Simulação)');
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        alert('Dados do aluno atualizados! (Simulação)');
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Alunos</h1>
                    <p className="text-gray-500">Gerenciamento de matrículas</p>
                </div>
                <Link
                    to="/students/new"
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm shadow-orange-500/20"
                >
                    <Plus size={20} />
                    Novo Aluno
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou responsável..."
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
                                <th className="p-4 font-semibold">Aluno</th>
                                <th className="p-4 font-semibold">Idade</th>
                                <th className="p-4 font-semibold">Responsável</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(student => (
                                <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                                                <User size={16} />
                                            </div>
                                            <span className="font-medium text-gray-900">{student.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{student.age} anos</td>
                                    <td className="p-4 text-gray-600">{student.guardian}</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {student.status === 'active' ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleEdit(student)}
                                                className="p-2 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
                                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
            {isModalOpen && selectedStudent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">Editar Aluno</h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                <input
                                    type="text"
                                    defaultValue={selectedStudent.name}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Idade</label>
                                    <input
                                        type="number"
                                        defaultValue={selectedStudent.age}
                                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        defaultValue={selectedStudent.status}
                                        className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-100 focus:border-orange-300 outline-none transition-all bg-white"
                                    >
                                        <option value="active">Ativo</option>
                                        <option value="inactive">Inativo</option>
                                    </select>
                                </div>
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
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors font-medium flex items-center gap-2"
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
