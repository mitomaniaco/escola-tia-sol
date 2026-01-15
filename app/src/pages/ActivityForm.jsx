import { ArrowLeft, Save, Coffee, Moon, Smile, Droplets, Book } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function ActivityForm() {
    const [selectedType, setSelectedType] = useState('');

    const activityTypes = [
        { id: 'food', label: 'Alimentação', icon: Coffee, color: 'orange' },
        { id: 'sleep', label: 'Sono', icon: Moon, color: 'blue' },
        { id: 'hygiene', label: 'Higiene', icon: Droplets, color: 'cyan' },
        { id: 'education', label: 'Atividade', icon: Book, color: 'green' },
        { id: 'mood', label: 'Comportamento', icon: Smile, color: 'purple' },
    ];

    return (
        <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link to="/pedagogical" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Novo Registro</h1>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">

                <div className="space-y-8">
                    {/* Target Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Para quem é este registro?</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="target" className="text-purple-600 focus:ring-purple-500" defaultChecked />
                                <span className="text-gray-700">Aluno Individual</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input type="radio" name="target" className="text-purple-600 focus:ring-purple-500" />
                                <span className="text-gray-700">Turma Inteira</span>
                            </label>
                        </div>
                        <select className="mt-3 w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all bg-white">
                            <option value="">Selecione o aluno...</option>
                            <option>Alice Silva</option>
                            <option>Bruno Santos</option>
                        </select>
                    </div>

                    {/* Activity Type Grid */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Atividade</label>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {activityTypes.map(type => (
                                <button
                                    key={type.id}
                                    onClick={() => setSelectedType(type.id)}
                                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${selectedType === type.id
                                            ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700 ring-2 ring-${type.color}-200`
                                            : 'border-gray-200 hover:bg-gray-50 text-gray-600'
                                        }`}
                                >
                                    <type.icon size={24} />
                                    <span className="text-xs font-medium">{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Detalhes / Observação</label>
                        <textarea
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all h-32 resize-none"
                            placeholder={selectedType === 'food' ? "Ex: Comeu tudo, repetiu..." : "Descreva a atividade..."}
                        ></textarea>
                    </div>

                    {/* Time */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Horário</label>
                        <input type="time" className="w-full p-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-100 focus:border-purple-300 outline-none transition-all" defaultValue="12:00" />
                    </div>
                </div>

                <div className="flex justify-end mt-10 pt-6 border-t border-gray-50">
                    <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-lg shadow-purple-600/20 hover:shadow-purple-600/30 transform hover:-translate-y-0.5 cursor-pointer">
                        <Save size={20} />
                        Salvar Registro
                    </button>
                </div>
            </div>
        </div>
    )
}
