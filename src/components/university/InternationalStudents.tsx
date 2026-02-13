import { useState, useEffect } from 'react';
import { Users, TrendingUp, MapPin, GraduationCap } from 'lucide-react';
import { getUniversityStudents, getUniversityFMGERates, UniversityStudent, UniversityFMGERate } from '../../Api';

interface InternationalStudentsProps {
  universityId: number;
}

const InternationalStudents: React.FC<InternationalStudentsProps> = ({ universityId }) => {
  const [students, setStudents] = useState<UniversityStudent[]>([]);
  const [fmgeRates, setFmgeRates] = useState<UniversityFMGERate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        if (!universityId) {
          setError('No university specified');
          return;
        }
        
        // Fetch both students and FMGE rates for the university
        const [studentsResponse, fmgeRatesResponse] = await Promise.all([
          getUniversityStudents(universityId),
          getUniversityFMGERates(universityId)
        ]);
        
        console.log('Students response:', studentsResponse);
        console.log('FMGE rates response:', fmgeRatesResponse);
        
        setStudents(studentsResponse.data.students);
        setFmgeRates(fmgeRatesResponse.data.fmge_rates);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (universityId) {
      fetchData();
    }
  }, [universityId]);

  // Helper function to format country name with ISO code
  const formatCountryName = (countryName: string, isoCode: string | null): string => {
    if (isoCode) {
      return `${isoCode} ${countryName}`;
    }
    return countryName;
  };

  // Calculate total students
  const totalStudents = students.reduce((sum, student) => sum + student.number_of_students, 0);

  // Calculate average acceptance rate from FMGE data
  const averageAcceptanceRate = fmgeRates.length > 0 
    ? (fmgeRates.reduce((sum, rate) => sum + parseFloat(rate.acceptance_rate), 0) / fmgeRates.length).toFixed(1)
    : '0';

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              International Students Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful international students who have chosen our university 
              for their medical education and achieved outstanding results.
            </p>
          </div>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <span className="ml-4 text-gray-600">Loading student data...</span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              International Students Success
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of successful international students who have chosen our university 
              for their medical education and achieved outstanding results.
            </p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            International Students Success
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful international students who have chosen our university 
            for their medical education and achieved outstanding results.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* International Students by Country */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-blue-100 p-3 rounded-lg">
                <MapPin className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Students by Country</h3>
            </div>
            
            <div className="space-y-4">
              {students.length > 0 ? (
                students.map((student) => (
                  <div 
                    key={student.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="font-semibold text-gray-900">{formatCountryName(student.country, student.country_iso_code)}</span>
                    </div>
                    <span className="text-blue-600 font-bold">{student.number_of_students.toLocaleString()}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No student data available</p>
                </div>
              )}
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Users className="h-6 w-6 text-blue-600" />
                <h4 className="text-lg font-semibold text-gray-900">Total International Students</h4>
              </div>
              <p className="text-3xl font-bold text-blue-600 mb-2">{totalStudents.toLocaleString()}</p>
              <p className="text-gray-600">From {students.length} countries worldwide</p>
            </div>
          </div>

          {/* FMGE Pass Rates */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-center space-x-3 mb-8">
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">FMGE Success Rate</h3>
            </div>

            <div className="space-y-4 mb-8">
              {fmgeRates.length > 0 ? (
                fmgeRates.map((rate) => (
                  <div 
                    key={rate.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors duration-200"
                  >
                    <div>
                      <span className="font-semibold text-gray-900">{rate.year}</span>
                      <p className="text-sm text-gray-600">{rate.total_applications.toLocaleString()} total applications</p>
                      <p className="text-sm text-gray-500">{rate.accepted_students.toLocaleString()} accepted students</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-green-600">{rate.acceptance_rate}%</span>
                      <p className="text-sm text-gray-600">Acceptance Rate</p>
                      <p className="text-xs text-gray-500">YoY: {rate.yoy_change}%</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No FMGE data available</p>
                </div>
              )}
            </div>

            <div className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-6 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <GraduationCap className="h-6 w-6" />
                <h4 className="text-lg font-semibold">Average FMGE Success</h4>
              </div>
              <p className="text-3xl font-bold mb-2">{averageAcceptanceRate}%</p>
              <p className="text-green-100">Based on {fmgeRates.length} year{fmgeRates.length !== 1 ? 's' : ''} of data</p>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why International Students Choose Us
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl">$</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Affordable Fees</h4>
              <p className="text-gray-600">Low tuition fees with no hidden costs</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-green-600 font-bold text-xl">EN</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">English Medium</h4>
              <p className="text-gray-600">Complete curriculum in English language</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <span className="text-purple-600 font-bold text-xl">✓</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Easy Admission</h4>
              <p className="text-gray-600">Simple application process, no entrance exam</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InternationalStudents;