import React from 'react';
import { Calendar, Users, Award, ExternalLink, MapPin, GraduationCap, CheckSquare, Square } from 'lucide-react';
import { Scholarship, University } from './types/scholarship';
import { useNavigate } from 'react-router-dom';


interface ScholarshipCardProps {
  university: University;
  scholarship: Scholarship;
  onViewDetails: (universityId: string, scholarshipId: string) => void;
  isSelected: boolean;
  onSelect: () => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  university,
  scholarship,
  isSelected,
  onSelect,
}) => { 
   const navigate = useNavigate();

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'merit':
        return 'bg-blue-100 text-blue-800';
      case 'need':
        return 'bg-green-100 text-green-800';
      case 'government':
        return 'bg-purple-100 text-purple-800';
      case 'private':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getModeColor = (mode: string) => {
    switch (mode) {
      case 'direct':
        return 'bg-emerald-100 text-emerald-800';
      case 'through_university':
        return 'bg-blue-100 text-blue-800';
      case 'through_ministry':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 overflow-hidden group flex flex-col h-full ${
      isSelected 
        ? 'border-red-500 shadow-red-100' 
        : 'border-gray-100'
    }`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold mb-1">{university.name}</h3>
            <div className="flex items-center text-blue-100">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{university.city}, {university.country}</span>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            {/* Selection Checkbox */}
            <button
              onClick={onSelect}
              className="p-1 hover:bg-white hover:bg-opacity-20 rounded transition-colors duration-200"
              aria-label={isSelected ? "Deselect scholarship" : "Select scholarship"}
            >
              {isSelected ? (
                <CheckSquare className="w-5 h-5 text-white" />
              ) : (
                <Square className="w-5 h-5 text-white opacity-70" />
              )}
            </button>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(scholarship.type)} bg-opacity-20 text-white border border-white border-opacity-30`}>
              {scholarship.type.charAt(0).toUpperCase() + scholarship.type.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="border-t border-red-500 border-opacity-30 pt-3">
          <h4 className="text-lg font-semibold">{scholarship.name}</h4>
        </div>
      </div>

      {/* Content - Flex grow to fill available space */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Scholarship Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <Award className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-semibold text-gray-900">{scholarship.amount}</p>
              {scholarship.percentage && (
                <p className="text-xs text-green-600">{scholarship.percentage}% off tuition</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Deadline</p>
              <p className="font-semibold text-gray-900">{scholarship.deadline}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Users className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Available Seats</p>
              <p className="font-semibold text-gray-900">{scholarship.seats}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <GraduationCap className="w-5 h-5 text-purple-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Program</p>
              <p className="font-semibold text-gray-900">{scholarship.levels.join(', ')}</p>
            </div>
          </div>
        </div>

        {/* Application Mode */}
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getModeColor(scholarship.applicationMode)}`}>
            {scholarship.applicationMode.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
        </div>

        {/* Eligibility Preview */}
        <div className="mb-6">
          <h5 className="text-sm font-semibold text-gray-900 mb-2">Key Eligibility:</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            {scholarship.eligibility.slice(0, 3).map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                {item}
              </li>
            ))}
            {scholarship.eligibility.length > 3 && (
              <li className="text-blue-600 font-medium">
                +{scholarship.eligibility.length - 3} more criteria
              </li>
            )}
          </ul>
        </div>

        {/* Coverage */}
        <div className="mb-6">
          <h5 className="text-sm font-semibold text-gray-900 mb-2">Coverage:</h5>
          <div className="flex flex-wrap gap-2">
            {scholarship.coverage.map((item, index) => (
              <span key={index} className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-md border border-green-200">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>

        {/* CTA Button - Fixed at bottom */}
        <button
          onClick={() => navigate(`/scholarships/${university.id}/${scholarship.id}`)}
          className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300 flex items-center justify-center group-hover:shadow-lg mt-auto"
        >
          View Full Details
          <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};