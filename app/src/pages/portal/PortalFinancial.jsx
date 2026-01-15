import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { DollarSign, CheckCircle, Clock, Copy, ExternalLink, Loader2, AlertCircle } from 'lucide-react';

export default function PortalFinancial() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [charges, setCharges] = useState([]);

    useEffect(() => {
        if (user?.email) fetchFinancialData();
    }, [user]);

    const fetchFinancialData = async () => {
        try {
            setLoading(true);
            // 1. Pegar ID do Guardião
            const { data: guardian } = await supabase
                .from('guardians')
                .select('id')
                .eq('email', user.email)
                .single();

            if (!guardian) return;

            // 2. Buscar cobranças vinculadas a este responsável
            const { data: records } = await supabase
                .from('financial_records')
                .select('*')
                .eq('guardian_id', guardian.id)
                .eq('type', 'income') // Apenas o que ele tem que pagar
                .order('due_date', { ascending: false });

            setCharges(records || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyPix = (code) => {
        navigator.clipboard.writeText(code);
        alert('Código Pix copiado!');
    };

    if (loading) return <div className="flex justify-center py-10"><Loader2 className="animate-spin text-green-500" /></div>;

    const pending = charges.filter(c => c.status === 'pending' || c.status === 'overdue');
    const history = charges.filter(c => c.status === 'paid');

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-800">Pagamentos</h2>

            {/* Pendentes */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Em Aberto</h3>

                {pending.length === 0 ? (
                    <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                        <CheckCircle className="text-green-500 mx-auto mb-2" size={32} />
                        <p className="text-green-800 font-medium">Tudo em dia!</p>
                        <p className="text-green-600 text-sm">Nenhuma cobrança pendente.</p>
                    </div>
                ) : (
                    pending.map(charge => (
                        <div key={charge.id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm relative overflow-hidden">
                            {charge.status === 'overdue' && (
                                <div className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">
                                    VENCIDO
                                </div>
                            )}

                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-gray-800">{charge.title}</h4>
                                    <p className="text-sm text-gray-500">Vence em: {new Date(charge.due_date).toLocaleDateString()}</p>
                                </div>
                                <span className="text-lg font-bold text-gray-800">
                                    R$ {Number(charge.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </span>
                            </div>

                            <div className="flex gap-2">
                                {charge.payment_url ? (
                                    <a
                                        href={charge.payment_url}
                                        target="_blank"
                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-green-700"
                                    >
                                        <DollarSign size={16} />
                                        Pagar Agora
                                    </a>
                                ) : (
                                    <button
                                        onClick={() => copyPix("00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-4266141740005204000053039865802BR5913Escola Tia Sol6008Brasilia62070503***63041D3D")}
                                        className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-green-700"
                                    >
                                        <Copy size={16} />
                                        Copiar Pix
                                    </button>
                                )}
                            </div>

                            {!charge.payment_url && (
                                <p className="text-xs text-gray-400 mt-2 text-center">
                                    Envie o comprovante no WhatsApp da escola.
                                </p>
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Histórico */}
            <div className="space-y-4 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Histórico Recente</h3>
                {history.length === 0 ? (
                    <p className="text-sm text-gray-400 italic">Nenhum pagamento anterior.</p>
                ) : (
                    history.map(charge => (
                        <div key={charge.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-700">{charge.title}</p>
                                <p className="text-xs text-gray-400">Pago em {new Date(charge.paid_at || charge.created_at).toLocaleDateString()}</p>
                            </div>
                            <span className="text-sm font-bold text-gray-600 line-through">
                                R$ {Number(charge.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
