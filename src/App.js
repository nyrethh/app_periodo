import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Heart, Star, Palette, Settings, Pill, BarChart2, Sparkles, Rabbit } from 'lucide-react';

// - Eliminadas importaciones no utilizadas (Flower, StatCard) para limpiar las advertencias.
import { THEMES, WEEK_DAYS, MOODS, ALL_SYMPTOMS } from './constants';
import AnimatedAvatar from './components/AnimatedAvatar';
import LogModal from './components/LogModal';
import SettingsModal from './components/SettingsModal';
import AnalysisPage from './components/AnalysisPage';
import StatCard from './components/StatCard';

export default function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [dayData, setDayData] = useState({});
  const [selectedDay, setSelectedDay] = useState(null);
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

  // Cargar datos desde localStorage al iniciar
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
    } catch (error) {
        console.error("Failed to load data from localStorage", error);
    }
  }, []);

  // Guardar datos en localStorage cuando cambien
  useEffect(() => {
    const dataToSave = {
        dayData, avgCycleLength, avgPeriodLength, avatar, userName, userAge, userWeight, userHeight, notifications, themeKey, symptomsList
    };
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
          const isEmpty = !dataForCleanup.isPeriod && 
                          (!dataForCleanup.symptoms || dataForCleanup.symptoms.length === 0) && 
                          !dataForCleanup.note && 
                          !dataForCleanup.sexualActivity && 
                          !dataForCleanup.mood && 
                          !dataForCleanup.medication && 
                          !dataForCleanup.flowType && 
                          !dataForCleanup.intercourseCount && 
                          !dataForCleanup.flowLevel &&
                          !dataForCleanup.tookEmergencyPill;

          if (isEmpty) {
              delete newDayData[dateKey];
          }

          return newDayData;
      });
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
  const currentPhaseData = cycleData[todayKey] || {};
  const isPeriodToday = dayData[todayKey]?.isPeriod;

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
    <div className={`min-h-screen ${currentTheme.bg} font-sans text-gray-700 p-4 sm:p-6 lg:p-8 transition-colors duration-500`}>
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6">
          <div className="flex items-center">
            <AnimatedAvatar avatarType={avatar} mood={todayMood} animationClass={avatarAnimationClass} theme={currentTheme} />
            <div className="ml-2">
                <h1 className={`text-3xl font-bold ${currentTheme.headerText} transition-colors duration-500`}>Mi calendario menstrual</h1>
                {userName && <h2 className={`text-lg ${currentTheme.secondaryText}`}>¡Hola, {userName}!</h2>}
            </div>
          </div>
          <div className="flex items-center mt-4 sm:mt-0">
             <button onClick={() => setView('analysis')} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 mr-2">
              <BarChart2 className={`${currentTheme.primaryIcon} transition-colors duration-500`} /></button>
             <button onClick={() => setShowSettings(true)} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100 mr-2">
              <Settings className={`${currentTheme.primaryIcon} transition-colors duration-500`} /></button>
             <div className="relative mr-2"><button onClick={() => setShowThemeSelector(!showThemeSelector)} className="p-2 rounded-full bg-white shadow-md hover:bg-gray-100"><Palette className={`${currentTheme.primaryIcon} transition-colors duration-500`} /></button>{showThemeSelector && (<div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl z-10 p-2 animate-modal-pop-in">{Object.keys(THEMES).map(key => (<button key={key} onClick={() => { setThemeKey(key); setShowThemeSelector(false); }} className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-100 text-gray-700">{THEMES[key].name}</button>))}</div>)}</div>
            <div className="flex items-center bg-white p-2 rounded-full shadow-md"><button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))} className={`p-2 rounded-full hover:bg-gray-100 ${currentTheme.primaryIcon} transition-colors`}><ChevronLeft /></button><h2 className={`w-48 text-center text-xl font-semibold ${currentTheme.secondaryText} capitalize transition-colors duration-500`}>{new Intl.DateTimeFormat('es-ES', { month: 'long', year: 'numeric' }).format(currentDate)}</h2><button onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))} className={`p-2 rounded-full hover:bg-gray-100 ${currentTheme.primaryIcon} transition-colors`}><ChevronRight /></button></div>
          </div>
        </header>

        <main>
            {view === 'calendar' ? (
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-modal-pop-in">
                    <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-lg">
                        <div className={`grid grid-cols-7 gap-1 text-center font-semibold ${currentTheme.secondaryText} mb-4 transition-colors duration-500`}>{WEEK_DAYS.map(day => <div key={day}>{day}</div>)}</div>
                        <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay() }).map((_, i) => <div key={`empty-${i}`} className="border-none"></div>)}
                        {Array.from({ length: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate() }).map((_, i) => {
                            const dayNumber = i + 1;
                            const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
                            const dateKey = dayDate.toISOString().split('T')[0];
                            const data = dayData[dateKey] || {};
                            const prediction = cycleData[dateKey] || {};
                            const isToday = new Date().toDateString() === dayDate.toDateString();
                            const mood = MOODS.find(m => m.id === data.mood);
                            let phaseBg = '';
                            if(prediction.phase === 'follicular') phaseBg = 'bg-blue-50';
                            if(prediction.phase === 'luteal') phaseBg = 'bg-purple-50';
                            if(prediction.type === 'fertile') phaseBg = 'bg-yellow-100';

                            return (
                            <div key={dateKey} onClick={() => setSelectedDay(dayDate)} className={`relative aspect-square flex flex-col justify-start items-center rounded-lg cursor-pointer transition-all duration-300 border-2 pt-1 ${isToday ? currentTheme.todayBorder : 'border-transparent'} ${data.isPeriod ? `${currentTheme.periodDayBg} ${currentTheme.periodDayText}` : phaseBg}`}>
                                <div className="absolute top-1 right-1 text-xs">{mood?.icon}</div>
                                <span className={`font-bold text-base`}>{dayNumber}</span>
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
                        <div className="bg-white p-6 rounded-3xl shadow-lg">
                            <h3 className={`text-xl font-bold ${currentTheme.secondaryText} mb-4 flex items-center transition-colors duration-500`}>
                                {isPeriodToday ? '🩸' : (currentPhaseData.phase === 'follicular' ? '🌸' : '🌙')} Fase Actual
                            </h3>
                            {isPeriodToday ? <p className="text-sm text-gray-600">Estás en tu periodo. Recuerda descansar y ser amable contigo misma.</p> :
                             currentPhaseData.phase === 'follicular' ? <p className="text-sm text-gray-600">Estás en tu fase folicular. Tu energía y claridad mental están en aumento. ¡Aprovecha para avanzar en tus metas!</p> :
                             currentPhaseData.phase === 'luteal' ? <p className="text-sm text-gray-600">Estás en tu fase lútea. Es normal sentir cambios de humor. ¡Recuerda cuidarte y darte un respiro!</p> :
                             <p className="text-sm text-gray-600">Registra tu primer periodo para ver la información de tus fases.</p>}
                        </div>
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

        {selectedDay && <LogModal day={selectedDay} data={dayData[selectedDay.toISOString().split('T')[0]]} onClose={() => setSelectedDay(null)} onSave={handleSaveData} theme={currentTheme} symptomsList={ALL_SYMPTOMS} onAddSymptom={(s) => setSymptomsList(prev => [...prev, s])}/>}
        {showSettings && <SettingsModal onClose={() => setShowSettings(false)} onSave={handleSaveSettings} theme={currentTheme} currentSettings={{userName, userAge, userWeight, userHeight, avgCycleLength, avgPeriodLength, avatar, notifications}} />}
      </div>
    </div>
  );
}
