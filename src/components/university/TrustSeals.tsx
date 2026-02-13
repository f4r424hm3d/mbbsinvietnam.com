import React from 'react';
import { Shield, Award, Globe, CheckCircle } from 'lucide-react';
import { UniversityDetails } from '../../Api';

interface TrustSealsProps {
  universityData: UniversityDetails;
}

const TrustSeals: React.FC<TrustSealsProps> = ({ universityData }) => {
  const seals = [
    {
      icon: Shield,
      title: 'Embassy Verified',
      subtitle: 'Indian Embassy Approved',
      description: 'Officially recognized and trusted by Indian Embassy in Kyrgyzstan',
      badge: 'VERIFIED',
      color: 'green',
      isActive: universityData.embassy_verified === 1
    },
    {
      icon: Globe,
      title: 'WHO Listed',
      subtitle: 'World Health Organization',
      description: 'Listed in WHO Directory of Medical Schools',
      badge: 'LISTED',
      color: 'blue',
      isActive: universityData.who_listed === 1
    },
    {
      icon: Award,
      title: 'NMC Approved',
      subtitle: 'National Medical Commission',
      description: 'Approved for Indian students to practice medicine in India',
      badge: 'APPROVED',
      color: 'purple',
      isActive: universityData.nmc_approved === 1
    },
    {
      icon: CheckCircle,
      title: 'Ministry Licensed',
      subtitle: 'Government of Kyrgyzstan',
      description: 'Licensed by Ministry of Education and Science',
      badge: 'LICENSED',
      color: 'orange',
      isActive: universityData.ministry_licensed === 1
    }
  ];

  const colorClasses = {
    green: 'from-green-500 to-emerald-500',
    blue: 'from-blue-500 to-cyan-500',
    purple: 'from-purple-500 to-indigo-500',
    orange: 'from-orange-500 to-red-500'
  };

  const badgeColors = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    orange: 'bg-orange-100 text-orange-800'
  };

  return (
    <section className="py-10 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trust & Recognition
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our university holds prestigious accreditations and recognitions from leading 
            international bodies, ensuring your degree is globally accepted.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {seals.map((seal, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
            >
              <div className="text-center">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${colorClasses[seal.color as keyof typeof colorClasses]} flex items-center justify-center shadow-lg`}>
                  <seal.icon className="h-10 w-10 text-white" />
                </div>
                
                <div className="mb-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${badgeColors[seal.color as keyof typeof badgeColors]}`}>
                    {seal.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">{seal.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{seal.subtitle}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{seal.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Additional Recognitions</h3>
            <p className="text-gray-600">Our university maintains high standards recognized globally</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold">FAIMER</span>
              </div>
              <h4 className="font-semibold text-gray-900">FAIMER Listed</h4>
              <p className="text-gray-600 text-sm">Foundation for Advancement of International Medical Education</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-green-600 font-bold">MCI</span>
              </div>
              <h4 className="font-semibold text-gray-900">MCI Recognition</h4>
              <p className="text-gray-600 text-sm">Medical Council of India approved institution</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-purple-600 font-bold">ECFMG</span>
              </div>
              <h4 className="font-semibold text-gray-900">ECFMG Eligible</h4>
              <p className="text-gray-600 text-sm">Educational Commission for Foreign Medical Graduates</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSeals;