import React, { useState } from 'react';
import { Plane, Clock, CheckCircle, XCircle, Search, Filter } from 'lucide-react';
import { mockStudents } from './data/mockData';

const VisaStatus: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const studentsWithVisa = mockStudents.filter(s => s.visaStatus && s.visaStatus !== 'Not Applied');
  
  const filteredStudents = studentsWithVisa.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.university.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || student.visaStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getVisaStatusColor = (status: string) => {
    switch (status) {
      case 'Applied': return { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock };
      case 'Approved': return { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle };
      case 'Rejected': return { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle };
      default: return { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock };
    }
  };

  const visaStats = {
    total: studentsWithVisa.length,
    applied: studentsWithVisa.filter(s => s.visaStatus === 'Applied').length,
    approved: studentsWithVisa.filter(s => s.visaStatus === 'Approved').length,
    rejected: studentsWithVisa.filter(s => s.visaStatus === 'Rejected').length,
  };

  const approvalRate = visaStats.total > 0 ? Math.round((visaStats.approved / visaStats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Visa Status Tracking</h1>
          <p className="text-gray-500 mt-1">Monitor visa applications and approvals</p>
        </div>
      </div>

      {/* Visa Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Applications</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{visaStats.total}</p>
              <p className="text-blue-600 text-sm font-medium mt-1">Active tracking</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100">
              <Plane className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Under Review</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{visaStats.applied}</p>
              <p className="text-yellow-600 text-sm font-medium mt-1">Processing...</p>
            </div>
            <div className="p-3 rounded-xl bg-yellow-100">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Approved</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{visaStats.approved}</p>
              <p className="text-green-600 text-sm font-medium mt-1">{approvalRate}% success rate</p>
            </div>
            <div className="p-3 rounded-xl bg-green-100">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Rejected</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{visaStats.rejected}</p>
              <p className="text-red-600 text-sm font-medium mt-1">Need follow-up</p>
            </div>
            <div className="p-3 rounded-xl bg-red-100">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search visa applications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Visa Applications Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Student</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">University</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Application Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Visa Status</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Application Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Timeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStudents.map((student) => {
                const visaColor = getVisaStatusColor(student.visaStatus!);
                const StatusIcon = visaColor.icon;
                
                return (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-blue-600 text-sm">
                            {student.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{student.university}</p>
                        <p className="text-sm text-gray-500">{student.program}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {student.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="w-4 h-4" />
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${visaColor.bg} ${visaColor.text}`}>
                          {student.visaStatus}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-900">{student.applicationDate}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500">
                        {student.visaStatus === 'Applied' && 'Awaiting decision (Est. 4-6 weeks)'}
                        {student.visaStatus === 'Approved' && 'Visa approved - Ready to travel'}
                        {student.visaStatus === 'Rejected' && 'Application rejected - Contact student'}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12">
          <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No visa applications found matching your criteria.</p>
        </div>
      )}

      {/* Visa Processing Tips */}
      <div className="bg-blue-50 rounded-xl border border-blue-100 p-6">
        <h4 className="font-semibold text-blue-900 mb-3">📋 Visa Processing Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <p><strong>For Applied Status:</strong> Follow up every 2 weeks with embassy/consulate</p>
            <p className="mt-2"><strong>For Approved Status:</strong> Remind students to book travel arrangements</p>
          </div>
          <div>
            <p><strong>For Rejected Status:</strong> Review rejection reasons and consider reapplication</p>
            <p className="mt-2"><strong>Processing Time:</strong> Most visas take 4-8 weeks to process</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisaStatus;