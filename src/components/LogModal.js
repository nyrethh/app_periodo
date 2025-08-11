// --- Versión 20 Cambios ---
// - Aumentado el tamaño de las imágenes de las emociones a 'w-12 h-12' (más grandes) para una mejor visibilidad.
// - Ajustado el padding del contenedor de la emoción para que el fondo de selección se vea bien con el nuevo tamaño.

import React, { useState } from 'react';
import { Droplet, Smile, Plus, X, Heart, Pill, Minus } from 'lucide-react';
import { INITIAL_SYMPTOMS, MORE_SYMPTOMS, MOODS, FLOW_TYPES } from '../constants';

const LogModal = ({ day, data, onClose, onSave, theme, onAddSymptom }) => {
  const [isPeriodDay, setIsPeriodDay] = useState(data?.isPeriod || false);
  const [selectedSymptoms, setSelectedSymptoms] = useState(data?.symptoms || []);
  const [note, setNote] = useState(data?.note || '');
  const [sexualActivity, setSexualActivity] = useState(data?.sexualActivity || null);
  const [intercourseCount, setIntercourseCount] = useState(data?.intercourseCount || 0);
  const [newSymptom, setNewSymptom] = useState('');
  const [flowLevel, setFlowLevel] = useState(data?.flowLevel || 0);
  const [mood, setMood] = useState(data?.mood || null);
  const [medication, setMedication] = useState(data?.medication || '');
  const [tookEmergencyPill, setTookEmergencyPill] = useState(data?.tookEmergencyPill || false);
  const [showMoreSymptoms, setShowMoreSymptoms] = useState(false);
  const [flowType, setFlowType] = useState(data?.flowType || null);
  const [showMedicationInput, setShowMedicationInput] = useState(!!data?.medication);

  const handleSave = () => {
    onSave(day.toISOString().split('T')[0], { isPeriod: isPeriodDay, symptoms: selectedSymptoms, note, sexualActivity, intercourseCount, flowLevel, mood, medication, tookEmergencyPill, flowType });
    onClose();
  };
  
  const getFlowDescription = (level) => {
    if (level >= 1 && level <= 2) return 'Poco';
    if (level === 3) return 'Medio';
    if (level >= 4) return 'Abundante';
    return '';
  };
  
  const formattedDate = new Intl.DateTimeFormat('es-ES', { dateStyle: 'full' }).format(day);
  const selectedMood = MOODS.find(m => m.id === mood);

  const renderIcon = (icon, label, sizeClass = 'w-11 h-11') => {
    if (typeof icon === 'string' && icon.startsWith('/')) {
      return <img src={process.env.PUBLIC_URL + icon} alt={label} className={`${sizeClass} mx-auto`} />;
    }
    return <span className="text-3xl">{icon}</span>;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4"><div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md transform transition-all scale-95 animate-modal-pop-in"><div className="flex justify-between items-center mb-4"><h2 className={`text-2xl font-bold ${theme.modalHeader} font-sans`}>{formattedDate}</h2><button onClick={onClose} className="text-gray-400 hover:text-pink-500 transition-colors"><X size={28} /></button></div><div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
       
       {/* Periodo y Sangrado */}

       <div><h3 className={`text-lg font-semibold ${theme.secondaryText} mb-3 flex items-center`}><Droplet className="mr-2" size={20}/>Periodo y Sangrado</h3><div className="flex items-center justify-center bg-gray-100 rounded-xl p-3 mb-3"><label className="flex items-center cursor-pointer"><input type="checkbox" checked={isPeriodDay} onChange={() => setIsPeriodDay(!isPeriodDay)} className="sr-only"/><div className={`w-16 h-9 rounded-full transition-all duration-300 ${isPeriodDay ? theme.toggleOn : 'bg-gray-300'}`}><div className={`w-7 h-7 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isPeriodDay ? 'translate-x-8' : 'translate-x-1'}`} style={{top: '4px', position: 'relative'}}></div></div><span className="ml-4 text-lg text-gray-700">{isPeriodDay ? 'Día de periodo' : 'No es día de periodo'}</span></label></div><div><div className="flex justify-center items-center space-x-2">{Array.from({length: 5}).map((_, i) => (<Droplet key={i} size={32} onClick={() => setFlowLevel(prev => prev === i + 1 ? 0 : i + 1)} className={`cursor-pointer transition-colors ${i < flowLevel ? 'text-red-500 fill-current' : 'text-gray-300'}`} />))}</div><p className="text-center text-sm text-gray-600 mt-2 h-4">{getFlowDescription(flowLevel)}</p></div></div>
       
       {/* Flujo */}

        <div><h3 className={`text-lg font-semibold ${theme.secondaryText} mb-3 flex items-center`}>Flujo</h3><div className="grid grid-cols-3 gap-2">{FLOW_TYPES.map(ft => (<button key={ft.id} onClick={() => setFlowType(prev => prev === ft.id ? null : ft.id)} className={`p-1 text-xs rounded-lg border-2 ${flowType === ft.id ? 'bg-purple-200 border-purple-400' : 'bg-gray-100 border-transparent'}`}>{ft.label}</button>))}</div></div>
      
      {/* Estado de ánimo */}

        <div><h3 className={`text-lg font-semibold ${theme.secondaryText} mb-3 flex items-center`}><Smile className="mr-2" size={20}/>¿Cómo te sientes hoy?</h3>
        <div className="bg-gray-100 rounded-xl p-2"><div className="flex justify-around">{MOODS.map(m => (<button key={m.id} onClick={() => setMood(m.id)} 
        className={`transition-all transform ${mood === m.id ? 'scale-125 active:scale-110' :  'hover:scale-150 active:scale-125'}`}>
          <div >{renderIcon(m.icon, m.label, `w-12 h-12 transition-all ${mood !== null && mood !== m.id ? 'filter grayscale opacity-60' : ''}`)}</div></button>))}</div>
          <p className="text-center text-sm text-gray-600 mt-2 h-4">{selectedMood?.label || ''}</p></div></div>

       {/* Relaciones sexuales */}

        <div><h3 className={`text-lg font-semibold ${theme.secondaryText} mb-3 flex items-center`}><Heart className="mr-2" size={20}/>Relaciones sexuales</h3><div className="grid grid-cols-3 gap-2 mb-3"><button onClick={() => {setSexualActivity(null); setIntercourseCount(0)}} className={`p-2 rounded-lg border-2 ${sexualActivity === null ? 'bg-gray-300 border-gray-400' : 'bg-gray-100 border-transparent'}`}>Ninguna</button><button onClick={() => setSexualActivity('protected')} className={`p-2 rounded-lg border-2 ${sexualActivity === 'protected' ? 'bg-blue-200 border-blue-400' : 'bg-gray-100 border-transparent'}`}>Con protección</button><button onClick={() => setSexualActivity('unprotected')} className={`p-2 rounded-lg border-2 ${sexualActivity === 'unprotected' ? 'bg-pink-200 border-pink-400' : 'bg-gray-100 border-transparent'}`}>Sin protección</button></div>{sexualActivity && <div className="flex flex-col items-center justify-center gap-2"><div className="flex items-center gap-4"><button onClick={() => setIntercourseCount(c => Math.max(0, c - 1))} className="p-2 bg-gray-200 rounded-full"><Minus size={16}/></button><div className="text-xl font-bold w-8 text-center">{intercourseCount}</div><button onClick={() => setIntercourseCount(c => c + 1)} className="p-2 bg-gray-200 rounded-full"><Plus size={16}/></button></div><p className="text-sm text-gray-500">veces</p></div>}</div>
      
       {/* Medicamentos */} 
        <div><h3 className={`text-lg font-semibold ${theme.secondaryText} mb-3 flex items-center`}><Pill className="mr-2" size={20}/>Medicamentos</h3>{!showMedicationInput ? <button onClick={() => setShowMedicationInput(true)} className="w-full p-2 bg-gray-100 rounded-lg flex items-center justify-center"><Plus size={16} className="mr-2"/>Añadir medicamento</button> : <input type="text" value={medication} onChange={(e) => setMedication(e.target.value)} placeholder="Pastilla diaria, vitaminas..." className="w-full p-2 border-2 border-gray-200 rounded-lg focus:ring-0 focus:border-purple-300 mb-2"/>}<label className="flex items-center cursor-pointer mt-2"><input type="checkbox" checked={tookEmergencyPill} onChange={() => setTookEmergencyPill(!tookEmergencyPill)} className="h-5 w-5 rounded border-gray-300 text-pink-500 focus:ring-pink-500"/><span className="ml-2 text-gray-700">Tomé la pastilla de emergencia</span></label></div>
     
      {/* SINTOMAS  */}       
        <div><h3 className={`text-lg font-semibold ${theme.secondaryText} mb-3 flex items-center`}>Síntomas</h3><div className="grid grid-cols-3 gap-3">{INITIAL_SYMPTOMS.map(symptom => (<button key={symptom.id} onClick={() => setSelectedSymptoms(prev => prev.includes(symptom.id) ? prev.filter(id => id !== symptom.id) : [...prev, symptom.id])} className={`p-3 rounded-xl text-center transition-all duration-200 border-2 ${selectedSymptoms.includes(symptom.id) ? 'bg-yellow-200 border-yellow-400 scale-105' : 'bg-gray-100 border-transparent'}`}><div className="h-10 flex items-center justify-center">{renderIcon(symptom.icon, symptom.label, 'w-8 h-8')}</div><p className="text-xs font-medium text-gray-700 mt-1">{symptom.label}</p></button>))}</div>{showMoreSymptoms && <div className="grid grid-cols-3 gap-3 mt-3 animate-modal-pop-in">{MORE_SYMPTOMS.map(symptom => (<button key={symptom.id} onClick={() => setSelectedSymptoms(prev => prev.includes(symptom.id) ? prev.filter(id => id !== symptom.id) : [...prev, symptom.id])} className={`p-3 rounded-xl text-center transition-all duration-200 border-2 ${selectedSymptoms.includes(symptom.id) ? 'bg-yellow-200 border-yellow-400 scale-105' : 'bg-gray-100 border-transparent'}`}><div className="h-10 flex items-center justify-center">{renderIcon(symptom.icon, symptom.label, 'w-8 h-8')}</div><p className="text-xs font-medium text-gray-700 mt-1">{symptom.label}</p></button>))}</div>}<button onClick={() => setShowMoreSymptoms(!showMoreSymptoms)} className="w-full mt-3 text-purple-600 font-semibold">{showMoreSymptoms ? 'Mostrar menos' : 'Más síntomas...'}</button></div>
      
      {/* <NOTAS DEL DÍA> */}
        <div><h3 className={`text-lg font-semibold ${theme.secondaryText} mb-2`}>Notas del día 📝</h3><textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Añade aquí tus notas personales..." className="w-full p-3 bg-gray-100 rounded-xl border-2 border-transparent focus:border-pink-300 focus:ring-0 transition-colors" rows="3"></textarea></div>
    </div><div className="mt-6 text-center"><button onClick={handleSave} className={`bg-gradient-to-br ${theme.buttonGradient} text-white font-bold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all`}>Guardar Cambios</button></div></div></div>
  );
};

export default LogModal;
