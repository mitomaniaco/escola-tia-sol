import { useState, useEffect } from 'react';
import { ArrowLeft, Save, DollarSign, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function FinancialChargeForm() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [students, setStudents] = useState([]);

    const [formData, setFormData] = useState({
        student_id: '',
        title: '',
        amount: '',
        due_date: '',
        notes: '', // opcional, mas não tem coluna no banco por enquanto, podemos ignorar ou adicionar ao titulo
        payment_method_pref: 'pix'
    });

    useEffect(() => {
        const fetchStudents = async () => {
            const { data } = await supabase.from('students').select('id, name').order('name');
            setStudents(data || []);
        };
        fetchStudents();
    }, []);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Descobrir quem paga (Responsável Financeiro)
            const { data: relations, error: relError } = await supabase
                .from('student_guardians')
                .select('guardian_id')
                .eq('student_id', formData.student_id)
                .eq('is_financial_responsible', true)
                .single();

            // Se não tiver responsável financeiro marcado, tenta pegar qualquer um ou falha
            let payerId = relations?.guardian_id;

            if (!payerId) {
                // Tenta pegar o primeiro responsável qualquer
                const { data: anyRel } = await supabase
                    .from('student_guardians')
                    .select('guardian_id')
                    .eq('student_id', formData.student_id)
                    .limit(1)
                    .single();

                if (anyRel) payerId = anyRel.guardian_id;
                else throw new Error('Este aluno não possui responsáveis cadastrados para vincular a cobrança.');
            }

            // 2. Criar Cobrança
            const { error } = await supabase
                .from('financial_charges')
                .insert({
                    student_id: formData.student_id,
                    guardian_id: payerId,
                    title: formData.title,
                    amount: parseFloat(formData.amount),
                    due_date: formData.due_date,
                    status: 'pending',
                    // notes: formData.notes (campo não existe no schema atual, ignorar ou concatenar)
                });

            if (error) throw error;

            alert('Cobrança gerada com sucesso!');
            navigate('/financial');

        } catch (error) {
            console.error('Erro ao gerar cobrança:', error);
            alert('Erro: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/financial" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Nova Cobrança</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Aluno(a)</label>
                        <select
                            name="student_id"
                            required
                            value={formData.student_id}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-300 outline-none transition-all bg-white"
                        >
                            <option value="">Selecione o aluno...</option>
                            {students.map(s => (
                                <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                        <input
                            type="text"
                            name="title"
                            required
                            list="descriptions"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-300 outline-none transition-all"
                            placeholder="Ex: Mensalidade Março"
                        />
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
                                <input
                                    type="number"
                                    name="amount"
                                    required
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-300 outline-none transition-all"
                                    placeholder="0,00"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Vencimento</label>
                            <input
                                type="date"
                                name="due_date"
                                required
                                value={formData.due_date}
                                onChange={handleChange}
                                className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-300 outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Forma de Pagamento Preferencial</label>
                        <select
                            name="payment_method_pref"
                            value={formData.payment_method_pref}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-300 outline-none transition-all bg-white"
                        >
                            <option value="boleto">Boleto Bancário</option>
                            <option value="pix">Pix</option>
                            <option value="open">Em Aberto (Decidir na hora)</option>
                        </select>
                        <p className="text-xs text-gray-400 mt-1">Isso gera o código Pix ou Boleto automaticamente.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Observações (Opcional)</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-100 focus:border-green-300 outline-none transition-all h-24 resize-none"
                            placeholder="Detalhes adicionais..."
                        ></textarea>
                    </div>
                </div>

                <div className="flex justify-end mt-10 pt-6 border-t border-gray-50">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-green-600/20 hover:shadow-green-600/30 transform hover:-translate-y-0.5 cursor-pointer"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        {loading ? 'Gerando...' : 'Gerar Cobrança'}
                    </button>
                </div>
            </form>
        </div>
    );
}
