import React from 'react';
import { GraduationCap, Award, Users, MapPin } from 'lucide-react';

export const StatsBanner: React.FC = () => {
  const stats = [
    {
      icon: <GraduationCap className="w-8 h-8" />,
      number: '6+',
      label: 'Medical Universities',
      color: 'text-blue-600'
    },
    {
      icon: <Award className="w-8 h-8" />,
      number: '100+',
      label: 'Scholarships Available',
      color: 'text-green-600'
    },
    {
      icon: <Users className="w-8 h-8" />,
      number: '500+',
      label: 'Indian Students',
      color: 'text-purple-600'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      number: '3+',
      label: 'Major Cities',
      color: 'text-orange-600'
    }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-12 rounded-xl mb-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">MBBS in Kyrgyzstan</h2>
        <p className="text-blue-100 text-lg">Affordable Medical Education with Scholarship Opportunities</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
        {stats.map((stat, index) => (
          <div key={index} className="text-center">
            <div className={`${stat.color} bg-white bg-opacity-20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold mb-1">{stat.number}</div>
            <div className="text-blue-100 text-sm">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};