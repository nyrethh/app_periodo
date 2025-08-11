import React from 'react';

const StatCard = ({ icon, value, label, color }) => (
  <div className={`flex flex-col items-center justify-center p-4 rounded-2xl shadow-md ${color}`}>
    <div className="text-4xl mb-2">{icon}</div>
    <div className="text-2xl font-bold text-gray-700">{value}</div>
    <div className="text-sm text-gray-600">{label}</div>
  </div>
);

export default StatCard;
