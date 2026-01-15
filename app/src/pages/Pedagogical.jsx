import { useState } from 'react';
import { Plus, Calendar, Search, Smile, Utensils, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_ACTIVITIES = [
    { id: 1, student: 'Alice Silva', type: 'lunch', description: 'Comeu tudo', time: '11:30', status: 'good' },
    { id: 2, student: 'Bruno Santos', type: 'nap', description: 'Dormiu 1h30', time: '13:00', status: 'good' },
    { id: 3, student: 'Carla Dias', type: 'mood', description: 'Chorou um pouco na chegada', time: '08:15', status: 'bad' },
    { id: 4, student: 'Alice Silva', type: 'snack', description: 'Aceitou bem as frutas', time: '15:00', status: 'good' },
];

export default function Pedagogical() {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const getActivityIcon = (type) => {
        switch (type) {
            case 'lunch':
            case 'snack': return <Utensils size={16} />;
            case 'nap': return <Moon size={16} />;
            case 'mood': return <Smile size={16} />;
            default: return <Calendar size={16} />;
        }
    };

    const getActivityColor = (type) => {
        switch (type) {
            case 'lunch':
            case 'snack': return 'bg-orange-100 text-orange-600';
            case 'nap': return 'bg-blue-100 text-blue-600';
            case 'mood': return 'bg-purple-100 text-purple-600';
            default: return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Diário de Classe</h1>
                    <p className="text-gray-500">Registro de atividades e rotina</p>
                </div>
                <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                    <Calendar size={20} className="text-gray-400 ml-2" />
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="outline-none text-gray-700 font-medium"
                    />
                </div>
                <Link
                    to="/pedagogical/new-entry"
                    className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm shadow-purple-600/20"
                >
                    <Plus size={20} />
                    Novo Registro
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Summary Cards */}
                <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Almoço</p>
                            <h4 className="font-bold text-lg text-gray-800">12/15 Registrados</h4>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
                            <Utensils size={20} />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Soneca</p>
                            <h4 className="font-bold text-lg text-gray-800">8/10 Dormindo</h4>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                            <Moon size={20} />
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Humor Geral</p>
                            <h4 className="font-bold text-lg text-green-600">Tranquilo</h4>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
                            <Smile size={20} />
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <span className="w-1 h-5 bg-purple-500 rounded-full"></span>
                        Linha do Tempo
                    </h3>

                    <div className="space-y-6 relative before:absolute before:left-2 before:top-2 before:bottom-0 before:w-0.5 before:bg-gray-100">
                        {MOCK_ACTIVITIES.map(activity => (
                            <div key={activity.id} className="relative pl-8">
                                <div className={`absolute left-0 top-0 w-4 h-4 rounded-full border-2 border-white ring-2 ring-gray-100 ${getActivityColor(activity.type).replace('text-', 'bg-').split(' ')[0]}`}></div>
                                <div className="bg-gray-50 rounded-lg p-4 transition-all hover:bg-white hover:shadow-md border border-gray-100 hover:border-purple-100">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="flex items-center gap-2 font-bold text-gray-800">
                                            {activity.student}
                                            <span className={`text-xs px-2 py-0.5 rounded-full flex items-center gap-1 ${getActivityColor(activity.type)}`}>
                                                {getActivityIcon(activity.type)} {activity.type === 'lunch' ? 'Almoço' : activity.type === 'nap' ? 'Soneca' : activity.type === 'snack' ? 'Lanche' : 'Humor'}
                                            </span>
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium">{activity.time}</span>
                                    </div>
                                    <p className="text-gray-600 text-sm">{activity.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit">
                    <h3 className="font-bold text-gray-800 mb-4">alunos sem registro</h3>
                    <div className="space-y-3">
                        {['Daniel Oliveira', 'Eduardo Lima', 'Fernanda Costa'].map((name, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                                <span className="text-sm font-medium text-red-800">{name}</span>
                                <Link to="/pedagogical/new-entry" className="text-xs font-bold text-red-600 hover:text-red-800">
                                    Registrar
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
