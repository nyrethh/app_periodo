import React, { useMemo } from 'react';
import { ChevronLeft } from 'lucide-react';
import { MOODS, ALL_SYMPTOMS } from '../constants';
import { SMART_MESSAGES } from '../constants/messages';

const AnalysisPage = ({ dayData, periodStarts, theme, onBack }) => {
    const smartAlerts = useMemo(() => {
        const alerts = [];
        const sortedData = Object.entries(dayData).sort((a, b) => new Date(a[0]) - new Date(b[0]));

        Object.keys(SMART_MESSAGES).forEach(key => {
            let consecutive = 0;
            sortedData.forEach(([, data]) => {
                const isMood = MOODS.some(m => m.id === key);
                const isSymptom = ALL_SYMPTOMS.some(s => s.id === key);

                let conditionMet = false;
                if(isMood) conditionMet = data.mood === key;
                if(isSymptom) conditionMet = data.symptoms?.includes(key);

                consecutive = conditionMet ? consecutive + 1 : 0;
                if (consecutive === 3) {
                    const messages = SMART_MESSAGES[key];
                    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
                    alerts.push({id: `${key}_alert_${sortedData.length}`, msg: randomMsg});
                }
            });
        });

        const periodData = sortedData.filter(([,data]) => data.isPeriod);
        if (periodData.length > 5) {
            const crampDays = periodData.filter(([,data]) => data.symptoms?.includes('cramps')).length;
            if ((crampDays / periodData.length) > 0.5) {
                 alerts.push({id: 'period_cramps', msg: "Notamos que los cólicos son comunes durante tu periodo. ¡Eres muy fuerte! Considera ejercicios suaves para aliviarlos."});
            }
        }

        return [...new Map(alerts.map(item => [item.id, item])).values()];
    }, [dayData]);

    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg animate-modal-pop-in">
            <button onClick={onBack} className={`mb-4 flex items-center font-semibold ${theme.primaryIcon}`}><ChevronLeft/> Volver al Calendario</button>
            <h2 className={`text-2xl font-bold ${theme.headerText} mb-6`}>Análisis de tu Ciclo</h2>

            {smartAlerts.length > 0 && <div className="mb-6 space-y-2">{smartAlerts.map(alert => <div key={alert.id} className="bg-yellow-100 border-l-4 border-yellow-400 text-yellow-800 p-3 rounded-lg text-sm">{alert.msg}</div>)}</div>}

            <div className="mb-6">
                <h3 className={`text-xl font-bold ${theme.secondaryText} mb-4`}>🌸 Conoce tu Fase Folicular</h3>
                <div className="text-sm text-gray-700 bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold">Día 1 a 14 aprox.</p>
                    <p className="mt-2">Comienza con tu menstruación. El estrógeno aumenta, mejorando tu energía, ánimo y concentración. Es un momento ideal para actividades productivas y sociales.</p>
                    <p className="font-semibold mt-3">Recomendaciones:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Inicia con ejercicios suaves y aumenta la intensidad progresivamente.</li>
                        <li>Opta por una dieta balanceada rica en frutas, verduras y proteínas.</li>
                        <li>Aprovecha para planificar proyectos y socializar.</li>
                    </ul>
                </div>
            </div>

             <div className="mb-6">
                <h3 className={`text-xl font-bold ${theme.secondaryText} mb-4`}>🌙 Conoce tu Fase Lútea</h3>
                <div className="text-sm text-gray-700 bg-purple-50 p-4 rounded-lg">
                    <p className="font-semibold">Día 15 a 28 aprox.</p>
                    <p className="mt-2">Comienza después de la ovulación. La progesterona aumenta, lo que puede generar irritabilidad, ansiedad o fatiga. Es momento de cuidarte.</p>
                    <p className="font-semibold mt-3">Recomendaciones:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Prefiere ejercicios suaves como yoga o caminatas.</li>
                        <li>Consume alimentos ricos en magnesio (nueces, espinacas).</li>
                        <li>Prioriza el descanso y actividades que te aporten calma.</li>
                    </ul>
                </div>
            </div>

            <div>
                <h3 className={`text-lg font-semibold ${theme.secondaryText} mb-2`}>Cronología de Registros</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {Object.entries(dayData).sort((a, b) => new Date(b[0]) - new Date(a[0])).map(([date, data]) => {
                         const mood = MOODS.find(m => m.id === data.mood);
                         const symptoms = data.symptoms?.map(id => ALL_SYMPTOMS.find(s => s.id === id)?.icon).join(' ');
                         return <div key={date} className="text-xs bg-gray-50 p-2 rounded-lg">{new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' }).format(new Date(date + 'T00:00:00'))}: {mood?.icon} {symptoms} {data.note && `"${data.note}"`}</div>
                    })}
                </div>
            </div>
        </div>
    );
};

export default AnalysisPage;