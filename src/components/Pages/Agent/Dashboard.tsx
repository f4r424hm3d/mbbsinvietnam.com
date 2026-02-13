import React from 'react';
import { Users, FileText, DollarSign, Plane, TrendingUp, } from 'lucide-react';
import { mockStats, mockStudents } from './data/mockData';

const Dashboard: React.FC = () => {
  const stats = mockStats;
  const recentStudents = mockStudents.slice(0, 5);

  const statCards = [
    {
      title: 'Total Leads',
      value: stats.totalLeads,
      icon: Users,
      color: 'blue',
      change: `+${stats.monthlyGrowth}%`
    },
    {
      title: 'Active Applications',
      value: stats.activeApplications,
      icon: FileText,
      color: 'green',
      change: '+8 this week'
    },
    {
      title: 'Total Commission',
      value: `$${stats.totalCommission.toLocaleString()}`,
      icon: DollarSign,
      color: 'emerald',
      change: '+15.3% this month'
    },
    {
      title: 'Visa Approvals',
      value: stats.visaApprovals,
      icon: Plane,
      color: 'purple',
      change: '85% success rate'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Lead': return 'bg-gray-100 text-gray-800';
      case 'Application Started': return 'bg-blue-100 text-blue-800';
      case 'Documents Submitted': return 'bg-yellow-100 text-yellow-800';
      case 'Under Review': return 'bg-orange-100 text-orange-800';
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Sarah! Here's your overview</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-green-50 px-4 py-2 rounded-lg">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-800 font-semibold">{stats.conversionRate}% Conversion Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <p className="text-green-600 text-sm font-medium mt-1">{stat.change}</p>
                </div>
                <div className={`p-3 rounded-xl bg-${stat.color}-100`}>
                  <Icon className={`w-6 h-6 text-${stat.color}-600`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Applications</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentStudents.map((student) => (
                <div key={student.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="font-semibold text-blue-600 text-sm">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.university}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(student.status)}`}>
                    {student.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Commission Breakdown</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Pending Commission</span>
                <span className="font-semibold text-orange-600">$12,400</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Paid This Month</span>
                <span className="font-semibold text-green-600">$8,750</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Earned</span>
                <span className="font-semibold text-blue-600">$45,600</span>
              </div>
              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Next Payout</span>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">$12,400</p>
                    <p className="text-sm text-gray-500">Feb 1, 2024</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
            Add New Lead
          </button>
          <button className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Generate Student Link
          </button>
          <button className="bg-purple-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors">
            Check Visa Status
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;