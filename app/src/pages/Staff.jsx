import { useState } from 'react';
import { Plus, Search, MoreHorizontal, UserCheck, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_STAFF = [
    { id: 1, name: 'Tia Ana', role: 'Professora', phone: '(11) 99999-1111', status: 'active' },
    { id: 2, name: 'Tia Ju', role: 'Monitora', phone: '(11) 98888-2222', status: 'active' },
    { id: 3, name: 'Tio Leo', role: 'Recreador', phone: '(11) 97777-3333', status: 'active' },
    { id: 4, name: 'Solange (Tia Sol)', role: 'Gerente', phone: '(11) 96666-4444', status: 'active' },
];

export default function Staff() {
    const [searchTerm, setSearchTerm] = useState('');

    const filtered = MOCK_STAFF.filter(s =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Funcionários</h1>
                    <p className="text-gray-500">Gestão da equipe escolar</p>
                </div>
                <Link
                    to="/staff/new"
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm shadow-orange-500/20"
                >
                    <Plus size={20} />
                    Novo Funcionário
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar por nome ou cargo..."
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
                                <th className="p-4 font-semibold">Nome</th>
                                <th className="p-4 font-semibold">Cargo</th>
                                <th className="p-4 font-semibold">Contato</th>
                                <th className="p-4 font-semibold">Status</th>
                                <th className="p-4 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filtered.map(person => (
                                <tr key={person.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                                <UserCheck size={16} />
                                            </div>
                                            <span className="font-medium text-gray-900">{person.name}</span>
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-600">{person.role}</td>
                                    <td className="p-4 text-gray-600 flex items-center gap-2">
                                        <Phone size={14} className="text-gray-400" />
                                        {person.phone}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${person.status === 'active'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-gray-100 text-gray-600'
                                            }`}>
                                            {person.status === 'active' ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <button
                                            onClick={() => alert(`Editando funcionário: ${person.name}`)}
                                            className="text-gray-400 hover:text-purple-600 transition-colors cursor-pointer"
                                            title="Editar"
                                        >
                                            <MoreHorizontal size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
