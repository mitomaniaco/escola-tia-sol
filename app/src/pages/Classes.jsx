import { useState } from 'react';
import { Plus, Search, MoreHorizontal, Users, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MOCK_CLASSES = [
    { id: 1, name: 'Berçário I', shift: 'Integral', capacity: 10, enrolled: 8, teacher: 'Tia Ana' },
    { id: 2, name: 'Berçário I', shift: 'Tarde', capacity: 12, enrolled: 5, teacher: 'Tia Ju' },
    { id: 3, name: 'Jardim I', shift: 'Manhã', capacity: 15, enrolled: 12, teacher: 'Tia Carol' },
    { id: 4, name: 'Jardim I', shift: 'Tarde', capacity: 15, enrolled: 10, teacher: 'Tia Carol' },
];

export default function Classes() {
    const [searchTerm, setSearchTerm] = useState('');

    // Grouping logic: object where keys are class names
    const groupedClasses = MOCK_CLASSES.reduce((acc, cls) => {
        if (!acc[cls.name]) {
            acc[cls.name] = [];
        }
        acc[cls.name].push(cls);
        return acc;
    }, {});

    const filteredGroupNames = Object.keys(groupedClasses).filter(name =>
        name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Turmas</h1>
                    <p className="text-gray-500">Gestão de salas e períodos</p>
                </div>
                <Link
                    to="/classes/new"
                    className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm shadow-orange-500/20"
                >
                    <Plus size={20} />
                    Nova Turma
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-4 border-b border-gray-50 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar turma..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-100 transition-all"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                    {filteredGroupNames.map(groupName => {
                        const classesInGroup = groupedClasses[groupName];
                        const totalStudents = classesInGroup.reduce((sum, c) => sum + c.enrolled, 0);
                        const totalCapacity = classesInGroup.reduce((sum, c) => sum + c.capacity, 0);

                        return (
                            <div key={groupName} className="border border-gray-100 rounded-xl p-5 hover:border-orange-200 transition-colors bg-white">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-800 text-lg">{groupName}</h3>
                                        <p className="text-xs text-gray-500">{classesInGroup.length} turnos ativos</p>
                                    </div>
                                    <div className="bg-orange-50 text-orange-700 px-3 py-1 rounded-full text-xs font-bold">
                                        {totalStudents} alunos total
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    {classesInGroup.map(cls => (
                                        <div key={cls.id} className="bg-gray-50 rounded-lg p-3 flex flex-col gap-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                                    <Clock size={14} className="text-gray-400" />
                                                    {cls.shift}
                                                </span>
                                                <span className="text-xs text-gray-500">{cls.teacher}</span>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                    <div
                                                        className="bg-green-500 h-1.5 rounded-full"
                                                        style={{ width: `${(cls.enrolled / cls.capacity) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-600 w-12 text-right">{cls.enrolled}/{cls.capacity}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                                    <button
                                        onClick={() => alert(`Visualizando detalhes da turma: ${groupName}`)}
                                        className="text-sm text-orange-600 font-medium hover:text-orange-700"
                                    >
                                        Ver Detalhes
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
