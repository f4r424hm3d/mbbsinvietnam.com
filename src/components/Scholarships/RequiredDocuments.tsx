import React from 'react';
import { FileText, CheckCircle } from 'lucide-react';
import { globalDocuments } from './data/scholarships';

export const RequiredDocuments: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
      <div className="flex items-center mb-6">
        <FileText className="w-6 h-6 text-blue-600 mr-3" />
        <h2 className="text-2xl font-bold text-gray-900">Required Documents</h2>
      </div>
      
      <p className="text-gray-600 mb-6">
        Below is the comprehensive list of documents required for MBBS scholarship applications in Kyrgyzstan. 
        Ensure all documents are properly notarized/apostilled as per embassy requirements.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {globalDocuments.map((document, index) => (
          <div key={index} className="flex items-start p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
            <span className="text-gray-800 font-medium">{document}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Important Notes:</h3>
        <ul className="text-blue-800 space-y-2 text-sm">
          <li>• All documents must be in English or officially translated</li>
          <li>• Original documents should be carried during travel</li>
          <li>• Apostille is required for documents as per bilateral agreements</li>
          <li>• Some universities may require additional documents specific to their admission process</li>
        </ul>
      </div>
    </div>
  );
};