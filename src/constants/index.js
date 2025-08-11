import { Rabbit, Cat } from 'lucide-react';
import React from 'react';

export const THEMES = {
  pastelDream:
   {
    name: 'Sueño Pastel',
    bg: 'bg-pink-50', 
    headerText: 'text-pink-600',
    primaryIcon: 'text-pink-400', 
    secondaryText: 'text-purple-700',
    buttonGradient: 'from-pink-500 to-purple-500', 
    periodDayBg: 'bg-pink-200', 
    periodDayText: 'text-white', 
    todayBorder: 'border-pink-400', 
    modalHeader: 'text-pink-600', 
    statCard1: 'bg-purple-100', 
    statCard2: 'bg-pink-100', 
    toggleOn: 'bg-pink-400'
     },

  sunnyMeadow:
   { 
    name: 'Prado Soleado',
    bg: 'bg-yellow-50',
    headerText: 'text-yellow-700',
    primaryIcon: 'text-yellow-500',
    secondaryText: 'text-green-700', 
    buttonGradient: 'from-yellow-500 to-green-500',
    periodDayBg: 'bg-yellow-300', 
    periodDayText: 'text-yellow-800', 
    todayBorder: 'border-yellow-500', 
    modalHeader: 'text-yellow-700', 
    statCard1: 'bg-green-100', 
    statCard2: 'bg-yellow-100', 
    toggleOn: 'bg-yellow-400' 
    },

  sakuraBlossom:
   { name: 'Flor de Cerezo', 
    bg: 'bg-red-50', 
    headerText: 'text-red-600', 
    primaryIcon: 'text-red-400', 
    secondaryText: 'text-gray-700', 
    buttonGradient: 'from-red-400 to-pink-400', 
    periodDayBg: 'bg-red-200', 
    periodDayText: 'text-white', 
    todayBorder: 'border-red-400', 
    modalHeader: 'text-red-600', 
    statCard1: 'bg-gray-200', 
    statCard2: 'bg-red-100', 
    toggleOn: 'bg-red-400'
   }
};
export const INITIAL_SYMPTOMS = [ { id: 'cramps', label: 'Cólicos', icon: '😖' }, { id: 'bloating', label: 'Hinchazón', icon: '🎈' }, { id: 'cravings', label: 'Antojos', icon: '🍫' }, { id: 'mood_swings', label: 'Cambios de humor', icon: '🎭' }, { id: 'headache', label: 'Dolor de cabeza', icon: '🤕' }, { id: 'fatigue', label: 'Cansancio', icon: '😴' }];
export const MORE_SYMPTOMS = [ { id: 'acne', label: 'Acné', icon: '🌋' }, { id: 'migraine', label: 'Migraña', icon: '😵' }, { id: 'dizziness', label: 'Mareos', icon: '💫' }, { id: 'fever', label: 'Fiebre', icon: '🤒' }, { id: 'gas', label: 'Gases', icon: '💨' }, { id: 'belly_pain', label: 'Dolor de vientre', icon: '💥' }, { id: 'constipation', label: 'Estreñimiento', icon: '🧱' }, { id: 'breast_pain', label: 'Dolor de senos', icon: '🍈' }, { id: 'back_pain', label: 'Dolor de espalda', icon: '🚶‍♀️' }, { id: 'nausea', label: 'Náuseas', icon: '🤢' }, { id: 'chills', label: 'Escalofríos', icon: '🥶' }, { id: 'hot_flashes', label: 'Sofocos', icon: '🥵' }, { id: 'irritation', label: 'Irritación', icon: '😠' }, { id: 'diarrhea', label: 'Diarrea', icon: '🚽' }];
export const ALL_SYMPTOMS = [...INITIAL_SYMPTOMS, ...MORE_SYMPTOMS];
export const MOODS = [
    { id: 'happy', label: 'Feliz', icon: '/images/feliz.svg' },
    { id: 'sad', label: 'Triste', icon: '/images/triste.svg' },
    { id: 'angry', label: 'Enojada', icon: '/images/enojada.svg' },
    { id: 'anxious', label: 'Ansiosa', icon: '/images/ansiosa.svg' },
    { id: 'calm', label: 'Calmada', icon: '/images/calmada.svg' },
];
export const FLOW_TYPES = [ { id: 'dry', label: 'Seco' }, { id: 'sticky', label: 'Pegajoso' }, { id: 'creamy', label: 'Cremoso' }, { id: 'watery', label: 'Acuoso' }, { id: 'egg_white', label: 'Clara de huevo' }, { id: 'spotting', label: 'Con sangre' }];
export const WEEK_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
export const AVATARS = { rabbit: ({...props}) => <Rabbit {...props} />, cat: ({...props}) => <Cat {...props} /> };

