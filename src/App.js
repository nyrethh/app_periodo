// --- Versión 24 Cambios ---
// - Implementado un modal de acción previo que aparece al hacer clic en un día del calendario.
// - Añadida la funcionalidad "Eliminar Periodo" que borra el registro completo de un periodo.
// - Eliminados los íconos de emoción de la vista del calendario para una interfaz más limpia.
// - Creada una nueva sección "Descripción del Día" que muestra los detalles del día seleccionado.
// - La sección "Descripción" ahora muestra los datos del día actual por defecto.

import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Heart, Star, Palette, Settings, Pill, BarChart2, Flower, Sparkles, Rabbit, Edit, Trash2 } from 'lucide-react';

// Importaciones de constantes y componentes
import { THEMES, WEEK_DAYS, MOODS, ALL_SYMPTOMS } from './constants';
import AnimatedAvatar from './components/AnimatedAvatar';
import LogModal from './components/LogModal';
import SettingsModal from './components/SettingsModal';
import AnalysisPage from './components/AnalysisPage';

// --- NUEVOS COMPONENTES INTERNOS ---

// Modal de acción que aparece al hacer clic en un día
const ActionModal = ({ onAdd, onDelete, onClose, theme }) => (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-xs text-center animate-modal-pop-in">
            <h3 className={`text-xl font-bold ${theme.secondaryText} mb-6`}>¿Qué deseas hacer?</h3>
            <div className="space-y-3">
                <button onClick={onAdd} className={`w-full flex items-center justify-center text-white font-bold py-3 px-6 rounded-full shadow-lg bg-gradient-to-br ${theme.buttonGradient} transform hover:-translate-y-1 transition-all`}>
                    <Edit className="mr-2" size={20} /> Añadir / Editar Datos
                </button>
                <button onClick={onDelete} className="w-full flex items-center justify-center bg-gray-200 text-gray-700 font-bold py-3 px-6 rounded-full shadow-md hover:bg-gray-300 transition-colors">
                    <Trash2 className="mr-2" size={20} /> Eliminar Periodo
                </button>
            </div>
            <button onClick={onClose} className="mt-6 text-sm text-gray-500 hover:text-gray-700">Cancelar</button>
        </div>
    </div>
);

// Panel que muestra la descripción del día seleccionado
const DayDescription = ({ day, data, theme }) => {
    const dayToDisplay = day || new Date();
    const dataToDisplay = data || {};
    
    const mood = MOODS.find(m => m.id === dataToDisplay.mood);
    const symptoms = dataToDisplay.symptoms?.map(id => ALL_SYMPTOMS.find(s => s.id === id));

    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg space-y-3">
            <div>
                <h3 className={`text-xl font-bold ${theme.secondaryText} mb-2`}>
                    Descripción del Día
                </h3>
                <p className="font-semibold text-sm text-purple-600">
                    {new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(dayToDisplay)}
                </p>
            </div>

            {Object.keys(dataToDisplay).length === 0 && <p className="text-sm text-gray-500">No hay datos registrados para este día.</p>}

            {mood && <div><p className="font-semibold text-sm">Emoción:</p><div className="flex items-center"><img src={process.env.PUBLIC_URL + mood.icon} alt={mood.label} className="w-6 h-6 mr-2" /><span>{mood.label}</span></div></div>}
            {symptoms && symptoms.length > 0 && <div><p className="font-semibold text-sm">Síntomas:</p><div className="flex flex-wrap gap-2 mt-1">{symptoms.map(s => s && <span key={s.id} className="text-xs bg-gray-100 rounded-full px-2 py-1">{s.icon} {s.label}</span>)}</div></div>}
            {dataToDisplay.medication && <div><p className="font-semibold text-sm">Medicamento:</p><p className="text-sm text-gray-600">{dataToDisplay.medication}</p></div>}
            {dataToDisplay.note && <div><p className="font-semibold text-sm">Nota:</p><p className="text-sm italic text-gray-600">"{dataToDisplay.note}"</p></div>}
        </div>
    );
};


export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayData, setDayData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null); // Para el LogModal
  const [actionDay, setActionDay] = useState(null); // Para el ActionModal
  const [viewedDay, setViewedDay] = useState(new Date()); // Para el panel de descripción
  const [showWelcome, setShowWelcome] = useState(true);
  const [themeKey, setThemeKey] = useState('pastelDream');
  const [showThemeSelector, setShowThemeSelector] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [view, setView] = useState('calendar');
  const [avgCycleLength, setAvgCycleLength] = useState(28);
  const [avgPeriodLength, setAvgPeriodLength] = useState(5);
  const [avatar, setAvatar] = useState('rabbit');
  const [symptomsList, setSymptomsList] = useState(ALL_SYMPTOMS);
  const [userName, setUserName] = useState('');
  const [userAge, setUserAge] = useState('');
  const [userWeight, setUserWeight] = useState('');
  const [userHeight, setUserHeight] = useState('');
  const [notifications, setNotifications] = useState({ period: true, ovulation: true, medication: true, time: '09:00' });

  // Cargar y Guardar datos... (sin cambios)
  useEffect(() => {
    try {
        const savedData = JSON.parse(localStorage.getItem('kawaiiPeriodTrackerData'));
        if (savedData && savedData.userName) {
            setDayData(savedData.dayData || {});
            setAvgCycleLength(savedData.avgCycleLength || 28);
            setAvgPeriodLength(savedData.avgPeriodLength || 5);
            setAvatar(savedData.avatar || 'rabbit');
            setUserName(savedData.userName || '');
            setUserAge(savedData.userAge || '');
            setUserWeight(savedData.userWeight || '');
            setUserHeight(savedData.userHeight || '');
            setNotifications(savedData.notifications || { period: true, ovulation: true, medication: true, time: '09:00' });
            setThemeKey(savedData.themeKey || 'pastelDream');
            setSymptomsList(savedData.symptomsList || ALL_SYMPTOMS);
            setShowWelcome(false);
        }
    } catch (error) { console.error("Failed to load data from localStorage", error); }
  }, []);

  useEffect(() => {
    const dataToSave = { dayData, avgCycleLength, avgPeriodLength, avatar, userName, userAge, userWeight, userHeight, notifications, themeKey, symptomsList };
    localStorage.setItem('kawaiiPeriodTrackerData', JSON.stringify(dataToSave));
  }, [dayData, avgCycleLength, avgPeriodLength, avatar, userName, userAge, userWeight, userHeight, notifications, themeKey, symptomsList]);

  const currentTheme = THEMES[themeKey];

  const periodStarts = useMemo(() => {
    return Object.keys(dayData).filter(date => dayData[date].isPeriod).map(date => new Date(date + 'T00:00:00')).sort((a, b) => a - b).reduce((acc, date) => {
      const prevDate = acc.length > 0 ? acc[acc.length - 1] : null;
      if (!prevDate || (date.getTime() - prevDate.getTime()) / (1000 * 3600 * 24) > 1) acc.push(date);
      return acc;
    }, []);
  }, [dayData]);

  const cycleData = useMemo(() => {
    const data = {};
    const lastPeriodStart = periodStarts.length > 0 ? periodStarts[periodStarts.length - 1] : null;
    if (lastPeriodStart) {
      for (let cycle = 0; cycle <= 12; cycle++) {
        const cycleStart = new Date(lastPeriodStart);
        cycleStart.setDate(cycleStart.getDate() + (avgCycleLength * cycle));
        const ovulationDay = new Date(cycleStart);
        ovulationDay.setDate(ovulationDay.getDate() + avgCycleLength - 14);
        for (let i = 0; i < avgCycleLength; i++) {
            const d = new Date(cycleStart);
            d.setDate(d.getDate() + i);
            const key = d.toISOString().split('T')[0];
            let phase = 'luteal';
            if (d < ovulationDay) phase = 'follicular';
            let type = null;
            if (i < avgPeriodLength) type = 'predictedPeriod';
            if (i >= avgCycleLength - 14 - 3 && i <= avgCycleLength - 14 + 2) type = 'fertile';
            data[key] = { phase, type };
        }
      }
    }
    return data;
  }, [periodStarts, avgCycleLength, avgPeriodLength]);

  const handleSaveData = (dateKey, newData) => {
      setDayData(prevDayData => {
          const newDayData = { ...prevDayData };
          const date = new Date(dateKey + 'T00:00:00');

          if (newData.isPeriod && !prevDayData[dateKey]?.isPeriod) {
              for (let i = 0; i < avgPeriodLength; i++) {
                  const currentDay = new Date(date);
                  currentDay.setDate(currentDay.getDate() + i);
                  const currentKey = currentDay.toISOString().split('T')[0];
                  newDayData[currentKey] = { ...newDayData[currentKey], isPeriod: true };
              }
          }

          newDayData[dateKey] = { ...newDayData[dateKey], ...newData };

          const dataForCleanup = newDayData[dateKey];
          const isEmpty = !dataForCleanup.isPeriod && (!dataForCleanup.symptoms || dataForCleanup.symptoms.length === 0) && !dataForCleanup.note && !dataForCleanup.sexualActivity && !dataForCleanup.mood && !dataForCleanup.medication && !dataForCleanup.flowType && !dataForCleanup.intercourseCount && !dataForCleanup.flowLevel && !dataForCleanup.tookEmergencyPill;

          if (isEmpty) { delete newDayData[dateKey]; }
          return newDayData;
      });
  };

  const handleDeletePeriod = (dateToDelete) => {
    const dateKey = dateToDelete.toISOString().split('T')[0];
    if (!dayData[dateKey]?.isPeriod) return;

    let periodStart = new Date(dateToDelete);
    while (true) {
        const prevDay = new Date(periodStart);
        prevDay.setDate(prevDay.getDate() - 1);
        const prevKey = prevDay.toISOString().split('T')[0];
        if (!dayData[prevKey]?.isPeriod) break;
        periodStart = prevDay;
    }

    setDayData(prevData => {
        const newData = { ...prevData };
        let currentDay = new Date(periodStart);
        while(true) {
            const currentKey = currentDay.toISOString().split('T')[0];
            if (newData[currentKey]?.isPeriod) {
                delete newData[currentKey].isPeriod;
                if (Object.keys(newData[currentKey]).length === 0) {
                    delete newData[currentKey];
                }
            } else {
                break;
            }
            currentDay.setDate(currentDay.getDate() + 1);
        }
        return newData;
    });
    setActionDay(null);
  };
  
  const handleSaveSettings = (settings) => {
    setAvgCycleLength(parseInt(settings.avgCycleLength, 10));
    setAvgPeriodLength(parseInt(settings.avgPeriodLength, 10));
    setAvatar(settings.avatar);
    setUserName(settings.userName);
    setUserAge(settings.userAge);
    setUserWeight(settings.userWeight);
    setUserHeight(settings.userHeight);
    setNotifications(settings.notifications);
  };
  
  const getAvatarAnimationClass = (avatarType, mood) => {
      if (!mood) { return avatarType === 'rabbit' ? 'animate-bounce-gentle' : 'animate-blink'; }
      switch (mood) {
          case 'happy': return 'animate-happy-bounce';
          case 'sad': return 'animate-sad-droop';
          case 'angry': return '';
          default: return avatarType === 'rabbit' ? 'animate-bounce-gentle' : 'animate-blink';
      }
  };

  const todayKey = new Date().toISOString().split('T')[0];
  const todayMood = dayData[todayKey]?.mood || null;
  const avatarAnimationClass = getAvatarAnimationClass(avatar, todayMood);

  if (showWelcome) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex flex-col justify-center items-center p-4 text-center font-sans">
            <Rabbit size={100} className="text-pink-400 mb-4 animate-bounce" />
            <h1 className="text-4xl font-bold text-purple-600 mb-2">Mi calendario menstrual</h1>
            <p className="text-lg text-pink-500 mb-8">Tu adorable compañero para el seguimiento de tu ciclo.</p>
            <button onClick={() => setShowWelcome(false)} className="bg-gradient-to-br from-pink-500 to-purple-500 text-white font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all text-lg flex items-center">
              <Sparkles className="mr-3" /> Iniciar
            </button>
        </div>
    );
  }

  return (
    <div className={`min-h-screen ${currentTheme.bg} font-sans text-gray-700 p-4 sm:p-6 lg:p-8`}>
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-wrap justify-between items-center mb-6 gap-4">
          <div className="flex items-center">
            <AnimatedAvatar avatarType={avatar} mood={todayMood} animationClass={avatarAnimationClass} theme={currentTheme} />
            <div className="ml-2">
                <h1 className={`text-2xl sm:text-3xl font-bold ${currentTheme.headerText} transition-colors duration-500`}>Mi calendario</h1>
                {userName && <h2 className={`text-md sm:text-lg ${currentTheme.secondaryText}`}>¡Hola, {userName}!</h2>}
            </div>
          </div>
          <div className="flex items-center justify-end space-x-2 w-full sm:w-auto">
             <button onClick={() => setView('analysis')} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"><BarChart2 className={`${currentTheme.primaryIcon} transition-colors duration-500`} /></button>
             <button onClick={() => setShowSettings(true)} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"><Settings className={`${currentTheme.primaryIcon} transition-colors duration-500`} /></button>
             <div className="relative"><button onClick={() => setShowThemeSelector(!showThemeSelector)} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"><Palette className={`${currentTheme.primaryIcon} transition-colors duration-500`} /></button>{showThemeSelector && (<div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl z-10 p-2 animate-modal-pop-in">{Object.keys(THEMES).map(key => (<button key={key} onClick={() => { setThemeKey(key); setShowThemeSelector(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">{THEMES[key].name}</button>))}</div>)}</div>
          </div>
        </header>
        
        <div className="flex items-center justify-between bg-white p-2 rounded-full shadow-md mb-6">
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className={`p-2 rounded-full hover:bg-pink-100 ${currentTheme.primaryIcon} transition-colors`}><ChevronLeft /></button>
            <h2 className={`text-lg font-semibold ${currentTheme.secondaryText} capitalize`}>{new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(currentDate)}</h2>
            <button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className={`p-2 rounded-full hover:bg-pink-100 ${currentTheme.primaryIcon} transition-colors`}><ChevronRight /></button>
        </div>

        <main>
            {view === 'calendar' ? (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-modal-pop-in">
                    <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-3xl shadow-lg">
                        <div className={`grid grid-cols-7 gap-1 text-center font-semibold ${currentTheme.secondaryText} mb-4 transition-colors duration-500 text-xs sm:text-base`}>{WEEK_DAYS.map(day => <div key={day}>{day}</div>)}</div>
                        <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => <div key={`empty-${i}`} className="border-none"></div>)}
                        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                            const dayNumber = i + 1;
                            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
                            const dateKey = dayDate.toISOString().split('T')[0];
                            const data = dayData[dateKey] || {};
                            const prediction = cycleData[dateKey] || {};
                            const isToday = new Date().toDateString() === dayDate.toDateString();
                            let phaseBg = '';
                            if(prediction.phase === 'follicular') phaseBg = 'bg-blue-50';
                            if(prediction.phase === 'luteal') phaseBg = 'bg-purple-50';
                            if(prediction.type === 'fertile') phaseBg = 'bg-yellow-100';

                            return (
                            <div key={dateKey} onClick={() => { setActionDay(dayDate); setViewedDay(dayDate); }} className={`relative aspect-square flex flex-col justify-center items-center rounded-lg cursor-pointer transition-all duration-300 border-2 ${isToday ? currentTheme.todayBorder : 'border-transparent'} ${data.isPeriod ? `${currentTheme.periodDayBg} ${currentTheme.periodDayText}` : phaseBg}`}>
                                <span className={`font-bold text-lg`}>{dayNumber}</span>
                                <div className="absolute bottom-1 flex items-center space-x-0.5">
                                {data.isPeriod && <Heart size={10} className="text-red-500 fill-current" />}
                                {prediction.type === 'predictedPeriod' && !data.isPeriod && <Heart size={10} className="text-red-300" />}
                                {prediction.type === 'fertile' && <Star size={10} className="text-yellow-400 fill-current" />}
                                {data.sexualActivity && <div className={`w-1.5 h-1.5 rounded-full ${data.sexualActivity === 'protected' ? 'bg-blue-500' : 'bg-rose-500'}`}></div>}
                                {data.medication && <Pill size={10} className="text-green-600" />}
                                {data.note && <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>}
                                </div>
                            </div>
                            );
                        })}
                        </div>
                    </div>

                    <div className="space-y-8">
                        <DayDescription day={viewedDay} data={dayData[viewedDay.toISOString().split('T')[0]]} theme={currentTheme} />
                        <div className="bg-white p-6 rounded-3xl shadow-lg">
                        <h3 className={`text-xl font-bold ${currentTheme.secondaryText} mb-4 flex items-center transition-colors duration-500`}>Leyenda</h3>
                        <ul className="space-y-2 text-xs text-gray-600">
                            <li className="flex items-center"><div className="w-4 h-4 rounded-full bg-blue-50 mr-2 border border-blue-200"></div> Fase Folicular</li>
                            <li className="flex items-center"><div className="w-4 h-4 rounded-full bg-purple-50 mr-2 border border-purple-200"></div> Fase Lútea</li>
                            <li className="flex items-center"><div className="w-4 h-4 rounded-full bg-yellow-100 mr-2 border border-yellow-200"></div> Días Fértiles</li>
                            <li className="flex items-center"><Heart size={14} className="text-red-500 fill-current mr-2"/> Periodo Registrado</li>
                            <li className="flex items-center"><Pill size={14} className="text-green-600 mr-2"/> Medicamento Registrado</li>
                        </ul>
                        </div>
                    </div>
                </div>
            ) : (
                <AnalysisPage dayData={dayData} symptomsList={ALL_SYMPTOMS} periodStarts={periodStarts} avgCycleLength={avgCycleLength} theme={currentTheme} onBack={() => setView('calendar')} />
            )}
        </main>

        {actionDay && <ActionModal 
            onClose={() => setActionDay(null)} 
            onAdd={() => { setSelectedDay(actionDay); setActionDay(null); }}
            onDelete={() => handleDeletePeriod(actionDay)}
            theme={currentTheme}
        />}
        {selectedDay && <LogModal day={selectedDay} data={dayData[selectedDay.toISOString().split('T')[0]]} onClose={() => setSelectedDay(null)} onSave={handleSaveData} theme={currentTheme} symptomsList={ALL_SYMPTOMS} onAddSymptom={(s) => setSymptomsList(prev => [...prev, s])}/>}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onSave={handleSaveSettings} theme={currentTheme} currentSettings={{userName, userAge, userWeight, userHeight, avgCycleLength, avgPeriodLength, avatar, notifications}} />}
      </div>
    </div>
  );
}
