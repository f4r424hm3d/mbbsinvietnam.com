import React from 'react';
import { Calendar, Users, ExternalLink, GraduationCap, Clock, DollarSign } from 'lucide-react';
import { UniversityProgram } from '../../../Api';

interface ScholarshipCardProps {
  program: UniversityProgram;
  onViewDetails: (universityId: string, program: UniversityProgram) => void;
}

export const ScholarshipCard: React.FC<ScholarshipCardProps> = ({
  program,
  onViewDetails: _onViewDetails
}) => {
   
  const getModeColor = (mode: string) => {
    switch (mode.toLowerCase()) {
      case 'full-time':
        return 'bg-green-100 text-green-800';
      case 'part-time':
        return 'bg-blue-100 text-blue-800';
      case 'online':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: string, currency: string) => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency === 'IND' ? 'INR' : 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };


 

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group flex flex-col h-full">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white min-h-[120px] flex flex-col justify-center">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h3 className="text-xl font-bold mb-1 leading-tight line-clamp-2">{program.program_name}</h3>
            <div className="flex items-center text-blue-100 mt-2">
              <GraduationCap className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="text-sm">{program.study_mode}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content - Flex grow to fill available space */}
      <div className="p-6 flex flex-col flex-grow">
        {/* Program Details */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center">
            <DollarSign className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Annual Fee</p>
              <p className="font-semibold text-gray-900">{formatCurrency(program.annual_tuition_fee, program.currency)}</p>
              <p className="text-xs text-gray-500">Total: {formatCurrency(program.total_fee, program.currency)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-5 h-5 text-red-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Deadline</p>
              <p className="font-semibold text-gray-900">{formatDate(program.application_deadline)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold text-gray-900">{program.duration}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Users className="w-5 h-5 text-purple-600 mr-2" />
            <div>
              <p className="text-sm text-gray-600">Intake</p>
              <p className="font-semibold text-gray-900">{program.intake}</p>
            </div>
          </div>
        </div>

        {/* Study Mode */}
        <div className="mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getModeColor(program.study_mode)}`}>
            {program.study_mode}
          </span>
        </div>

        {/* Eligibility Preview */}
        <div className="mb-6">
          <h5 className="text-sm font-semibold text-gray-900 mb-2">Eligibility:</h5>
          <div 
            className="text-sm text-gray-600"
            dangerouslySetInnerHTML={{ 
              __html: program.eligibility.length > 200 
                ? program.eligibility.substring(0, 200) + '...' 
                : program.eligibility 
            }}
          />
        </div>

        {/* Overview */}
        <div className="mb-6">
          <h5 className="text-sm font-semibold text-gray-900 mb-2">Overview:</h5>
          <div 
            className="text-sm text-gray-600"
            dangerouslySetInnerHTML={{ 
              __html: program.overview.length > 150 
                ? program.overview.substring(0, 150) + '...' 
                : program.overview 
            }}
          />
        </div>

        {/* Spacer to push button to bottom */}
        <div className="flex-grow"></div>

        {/* CTA Button - Fixed at bottom */}
        <button
          onClick={() => _onViewDetails(program.university_id.toString(), program)}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center group-hover:shadow-lg mt-auto"
        >
          View Full Details
          <ExternalLink className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};