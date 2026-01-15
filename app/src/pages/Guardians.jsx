import { useState, useEffect } from 'react';
import { Plus, Search, User, Users, X, Save, Trash2, Edit, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Guardians() {
    const [guardians, setGuardians] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedGuardian, setSelectedGuardian] = useState(null);

    useEffect(() => {
        fetchGuardians();
    }, []);

    const fetchGuardians = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('guardians')
                .select(`
                    *,
                    student_guardians (
                        relationship_type,
                        students (name)
                    )
                `)
                .order('name');

            if (error) throw error;
            setGuardians(data || []);
        } catch (error) {
            console.error('Erro ao buscar responsáveis:', error);
            alert('Erro ao buscar responsáveis');
        } finally {
            setLoading(false);
        }
    };

    const filtered = guardians.filter(g => {
        const nameMatch = g.name.toLowerCase().includes(searchTerm.toLowerCase());
        const studentMatch = g.student_guardians?.some(sg =>
            sg.students?.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return nameMatch || studentMatch;
    });

    const handleEdit = (guardian) => {
        // Encontra o relacionamento principal para preencher o select de "Vínculo" no modal simples
        // Em um cenário real complexo, um responsável poderia ser Pai de um e Tio de outro.
        // Aqui pegamos o primeiro para simplificar a edição rápida.
        const mainRelation = guardian.student_guardians?.[0]?.relationship_type || '';

        setSelectedGuardian({ ...guardian, relation: mainRelation });
        setIsModalOpen(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Tem certeza que deseja remover este responsável? Isso também removerá os vínculos com os alunos.')) return;

        try {
            const { error } = await supabase.from('guardians').delete().eq('id', id);
            if (error) throw error;

            setGuardians(prev => prev.filter(g => g.id !== id));
            alert('Responsável removido com sucesso');
        } catch (error) {
            console.error(error);
            alert('Erro ao remover responsável');
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            // Atualiza dados básicos do responsável
            const { error } = await supabase
                .from('guardians')
                .update({
                    name: e.target.name.value,
                    phone: e.target.phone.value
                })
                .eq('id', selectedGuardian.id);

            if (error) throw error;

            // Nota: Atualizar o "Vínculo" aqui é complexo pois pode afetar vários alunos.
            // Por simplicidade neste modal rápido, atualizamos apenas dados cadastrais.

            alert('Dados atualizados com sucesso!');
            setIsModalOpen(false);
            fetchGuardians();
        } catch (error) {
            console.error(error);
            alert('Erro ao salvar alterações');
        }
    };

    const translateRelation = (rel) => {
        const map = {
            'father': 'Pai',
            'mother': 'Mãe',
            'grandparent': 'Avô/Avó',
            'uncle': 'Tio/Tia',
            'financial_responsible': 'Resp. Financeiro',
            'other': 'Outro'
        };
        return map[rel] || rel;
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
                                <th className="p-4 font-semibold">Contato</th>
                                <th className="p-4 font-semibold text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">
                                        <div className="flex justify-center items-center gap-2">
                                            <Loader2 className="animate-spin" /> Carregando...
                                        </div>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">
                                        Nenhum responsável encontrado.
                                    </td>
                                </tr>
                            ) : (
                                filtered.map(guardian => (
                                    <tr key={guardian.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <User size={16} />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-gray-900">{guardian.name}</span>
                                                    <span className="text-xs text-gray-400">{guardian.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-wrap gap-2">
                                                {guardian.student_guardians?.map((sg, idx) => (
                                                    <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-xs text-gray-700 border border-gray-200" title={translateRelation(sg.relationship_type)}>
                                                        <Users size={12} />
                                                        {sg.students?.name}
                                                    </span>
                                                ))}
                                                {(!guardian.student_guardians || guardian.student_guardians.length === 0) &&
                                                    <span className="text-gray-400 italic text-sm">Sem vínculos</span>
                                                }
                                            </div>
                                        </td>
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
                                ))
                            )}
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
                                    name="name"
                                    defaultValue={selectedGuardian.name}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone / WhatsApp</label>
                                <input
                                    type="text"
                                    name="phone"
                                    defaultValue={selectedGuardian.phone}
                                    className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:border-blue-300 outline-none transition-all"
                                />
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
