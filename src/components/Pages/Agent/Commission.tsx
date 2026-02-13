import React from 'react';
import { DollarSign, TrendingUp, Calendar, Download } from 'lucide-react';
import { mockStudents } from './data/mockData';

const Commission: React.FC = () => {
  const paidCommissions = mockStudents.filter(s => ['Approved', 'Visa Approved', 'Enrolled'].includes(s.status));
  const pendingCommissions = mockStudents.filter(s => ['Under Review', 'Documents Submitted', 'Visa Applied'].includes(s.status));
  
  const totalPaid = paidCommissions.reduce((sum, s) => sum + s.commission, 0);
  const totalPending = pendingCommissions.reduce((sum, s) => sum + s.commission, 0);
  const totalEarned = totalPaid + totalPending;

  const commissionBreakdown = [
    { university: 'University of Toronto', students: 8, commission: 18400, rate: '12%' },
    { university: 'McGill University', students: 5, commission: 12800, rate: '10%' },
    { university: 'UBC', students: 6, commission: 9600, rate: '8%' },
    { university: 'York University', students: 4, commission: 4800, rate: '6%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Commission Tracking</h1>
          <p className="text-gray-500 mt-1">Monitor your earnings and commission breakdown</p>
        </div>
        <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Commission Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Total Earned</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${totalEarned.toLocaleString()}</p>
              <p className="text-green-600 text-sm font-medium mt-1">+15.3% this month</p>
            </div>
            <div className="p-3 rounded-xl bg-green-100">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Paid Commission</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${totalPaid.toLocaleString()}</p>
              <p className="text-blue-600 text-sm font-medium mt-1">Last payment: Jan 1</p>
            </div>
            <div className="p-3 rounded-xl bg-blue-100">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Pending Commission</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${totalPending.toLocaleString()}</p>
              <p className="text-orange-600 text-sm font-medium mt-1">Processing...</p>
            </div>
            <div className="p-3 rounded-xl bg-orange-100">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">Average per Student</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">${Math.round(totalEarned / mockStudents.length).toLocaleString()}</p>
              <p className="text-purple-600 text-sm font-medium mt-1">Across {mockStudents.length} students</p>
            </div>
            <div className="p-3 rounded-xl bg-purple-100">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Commission by University */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Commission by University</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {commissionBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{item.university}</span>
                      <span className="text-sm text-gray-500">{item.students} students</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(item.commission / totalEarned) * 100}%` }}
                        ></div>
                      </div>
                      <span className="font-semibold text-gray-900">${item.commission.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Commission History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Commission History</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {paidCommissions.slice(0, 5).map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-green-600 text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.university}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${student.commission.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{student.lastUpdated}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Schedule */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="font-semibold text-blue-900">Next Payment</div>
            <div className="text-2xl font-bold text-blue-900 mt-1">Feb 1, 2024</div>
            <div className="text-blue-700 mt-1">${totalPending.toLocaleString()} expected</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="font-semibold text-green-900">Payment Cycle</div>
            <div className="text-2xl font-bold text-green-900 mt-1">Monthly</div>
            <div className="text-green-700 mt-1">1st of each month</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="font-semibold text-purple-900">Payment Method</div>
            <div className="text-2xl font-bold text-purple-900 mt-1">Bank Transfer</div>
            <div className="text-purple-700 mt-1">Account ending in 4567</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commission;