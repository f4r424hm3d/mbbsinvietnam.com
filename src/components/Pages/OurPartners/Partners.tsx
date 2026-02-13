import { useState, useMemo , useEffect} from 'react';
import PartnerApplicationForm from './PartnerApplicationForm';
import ContactTeam from './ContactTeam';
import ContactFormPopup from './ContactFormPopup';
import {
    MapPin,
    Users,
    Globe,
    Phone,
    Mail,

    Search,
    Star,
    Award,

    ExternalLink,

    Shield,
    CheckCircle,
    Target,
    TrendingUp,
    Handshake
} from 'lucide-react';

interface Partner {
    id: string;
    name: string;
    company: string;
    email: string;
    mobile: string;
    city: string;
    state: string;
    designation: string;
    experience: string;
    specialization: string[];
    rating: number;
    studentsPlaced: number;
    joinedYear: number;
    image: string;
    verified: boolean;
}

const partners: Partner[] = [
    {
        id: '1',
        name: 'Dr. Rajesh Kumar',
        company: 'MedEdu Consultants Pvt Ltd',
        email: 'rajesh.kumar@mededu.com',
        mobile: '+91 98765 43210',
        city: 'New Delhi',
        state: 'Delhi',
        designation: 'Senior Education Consultant',
        experience: '12 years',
        specialization: ['MBBS Admissions', 'Medical Counseling', 'Visa Assistance'],
        rating: 4.9,
        studentsPlaced: 450,
        joinedYear: 2018,
        image: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=300',
        verified: true
    },
    {
        id: '2',
        name: 'Priya Sharma',
        company: 'Global Medical Education',
        email: 'priya.sharma@globalmeded.in',
        mobile: '+91 87654 32109',
        city: 'Mumbai',
        state: 'Maharashtra',
        designation: 'Director - International Relations',
        experience: '8 years',
        specialization: ['International Admissions', 'Student Support', 'Career Guidance'],
        rating: 4.8,
        studentsPlaced: 320,
        joinedYear: 2019,
        image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=300',
        verified: true
    },
    {
        id: '3',
        name: 'Amit Patel',
        company: 'Future Doctors Academy',
        email: 'amit.patel@futuredoctors.co.in',
        mobile: '+91 76543 21098',
        city: 'Ahmedabad',
        state: 'Gujarat',
        designation: 'Founder & CEO',
        experience: '15 years',
        specialization: ['NEET Coaching', 'Abroad Studies', 'Scholarship Guidance'],
        rating: 4.9,
        studentsPlaced: 680,
        joinedYear: 2016,
        image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
        verified: true
    },
    {
        id: '4',
        name: 'Dr. Sunita Reddy',
        company: 'South India Medical Consultancy',
        email: 'sunita.reddy@simconsult.com',
        mobile: '+91 65432 10987',
        city: 'Hyderabad',
        state: 'Telangana',
        designation: 'Chief Medical Advisor',
        experience: '10 years',
        specialization: ['Medical Admissions', 'University Partnerships', 'Student Mentoring'],
        rating: 4.7,
        studentsPlaced: 380,
        joinedYear: 2020,
        image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300',
        verified: true
    },
    {
        id: '5',
        name: 'Vikram Singh',
        company: 'North Star Education Services',
        email: 'vikram.singh@northstar.edu.in',
        mobile: '+91 54321 09876',
        city: 'Jaipur',
        state: 'Rajasthan',
        designation: 'Regional Manager',
        experience: '6 years',
        specialization: ['Study Abroad', 'Documentation', 'Pre-departure Support'],
        rating: 4.6,
        studentsPlaced: 250,
        joinedYear: 2021,
        image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        verified: true
    },
    {
        id: '6',
        name: 'Meera Krishnan',
        company: 'Kerala Medical Education Hub',
        email: 'meera.krishnan@kmeh.org',
        mobile: '+91 43210 98765',
        city: 'Kochi',
        state: 'Kerala',
        designation: 'Senior Counselor',
        experience: '9 years',
        specialization: ['Medical Counseling', 'Admission Guidance', 'Parent Consultation'],
        rating: 4.8,
        studentsPlaced: 420,
        joinedYear: 2019,
        image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=300',
        verified: true
    },
    {
        id: '7',
        name: 'Ravi Gupta',
        company: 'Eastern Medical Consultants',
        email: 'ravi.gupta@easternmed.in',
        mobile: '+91 32109 87654',
        city: 'Kolkata',
        state: 'West Bengal',
        designation: 'Business Development Manager',
        experience: '7 years',
        specialization: ['Business Development', 'University Relations', 'Student Recruitment'],
        rating: 4.5,
        studentsPlaced: 290,
        joinedYear: 2020,
        image: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=300',
        verified: true
    },
    {
        id: '8',
        name: 'Dr. Anita Joshi',
        company: 'Himalayan Education Services',
        email: 'anita.joshi@himalayanedu.com',
        mobile: '+91 21098 76543',
        city: 'Dehradun',
        state: 'Uttarakhand',
        designation: 'Medical Education Specialist',
        experience: '11 years',
        specialization: ['Medical Education', 'Research Guidance', 'Academic Support'],
        rating: 4.9,
        studentsPlaced: 360,
        joinedYear: 2018,
        image: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=300',
        verified: true
    },
    {
        id: '9',
        name: 'Suresh Nair',
        company: 'Bangalore Medical Academy',
        email: 'suresh.nair@bmacademy.co.in',
        mobile: '+91 10987 65432',
        city: 'Bangalore',
        state: 'Karnataka',
        designation: 'Academic Director',
        experience: '13 years',
        specialization: ['Academic Planning', 'Curriculum Design', 'Faculty Training'],
        rating: 4.7,
        studentsPlaced: 520,
        joinedYear: 2017,
        image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
        verified: true
    },
    {
        id: '10',
        name: 'Kavita Agarwal',
        company: 'Central India Medical Services',
        email: 'kavita.agarwal@cims.edu.in',
        mobile: '+91 09876 54321',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        designation: 'Operations Manager',
        experience: '5 years',
        specialization: ['Operations Management', 'Student Services', 'Quality Assurance'],
        rating: 4.6,
        studentsPlaced: 180,
        joinedYear: 2022,
        image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=300',
        verified: true
    }
];

function Partners() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedState, setSelectedState] = useState('All States');
    const [selectedCity, setSelectedCity] = useState('All Cities');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showApplicationForm, setShowApplicationForm] = useState(false);
    const [showContactTeam, setShowContactTeam] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

    const states = ['All States', ...Array.from(new Set(partners.map(p => p.state))).sort()];
    const cities = selectedState === 'All States'
        ? ['All Cities', ...Array.from(new Set(partners.map(p => p.city))).sort()]
        : ['All Cities', ...Array.from(new Set(partners.filter(p => p.state === selectedState).map(p => p.city))).sort()];

    const filteredPartners = useMemo(() => {
        return partners.filter(partner => {
            const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                partner.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                partner.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                partner.state.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesState = selectedState === 'All States' || partner.state === selectedState;
            const matchesCity = selectedCity === 'All Cities' || partner.city === selectedCity;

            return matchesSearch && matchesState && matchesCity;
        });
    }, [searchTerm, selectedState, selectedCity]);

    const partnersByState = useMemo(() => {
        const grouped = filteredPartners.reduce((acc, partner) => {
            if (!acc[partner.state]) {
                acc[partner.state] = [];
            }
            acc[partner.state].push(partner);
            return acc;
        }, {} as Record<string, Partner[]>);

        return Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b));
    }, [filteredPartners]);

    const totalStats = useMemo(() => {
        return {
            totalPartners: partners.length,
            totalStudents: partners.reduce((sum, p) => sum + p.studentsPlaced, 0),
            averageRating: (partners.reduce((sum, p) => sum + p.rating, 0) / partners.length).toFixed(1),
            states: new Set(partners.map(p => p.state)).size
        };
    }, []);
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }, []);

    const handleContactNow = (partner: Partner) => {
        setSelectedPartner(partner);
        setShowContactForm(true);
    };

    if (showApplicationForm) {
        return <PartnerApplicationForm />;
    }

    if (showContactTeam) {
        return <ContactTeam />;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-red-700 via-red-600 to-orange-600 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-black/30"></div>
                <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920')] bg-cover bg-center opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center mb-6">
                            <MapPin className="w-8 h-8 text-orange-300 mr-3" />
                            <span className="text-orange-200 text-lg font-medium">India Network</span>
                        </div>

                        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                            Our <span className="text-orange-300">Partners</span> in India
                        </h1>

                        <p className="text-xl text-orange-100 mb-8 max-w-4xl mx-auto leading-relaxed">
                            Meet our trusted network of education consultants and partners across India who help
                            students achieve their dreams of studying medicine abroad. From counseling to admissions,
                            they provide comprehensive support throughout your journey.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                            <div className="text-center">
                                <div className="text-4xl font-bold text-orange-300 mb-2">{totalStats.totalPartners}+</div>
                                <div className="text-orange-200">Trusted Partners</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-orange-300 mb-2">{totalStats.totalStudents}+</div>
                                <div className="text-orange-200">Students Placed</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-orange-300 mb-2">{totalStats.averageRating}</div>
                                <div className="text-orange-200">Average Rating</div>
                            </div>
                            <div className="text-center">
                                <div className="text-4xl font-bold text-orange-300 mb-2">{totalStats.states}</div>
                                <div className="text-orange-200">States Covered</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="py-12 bg-gray-50  top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-2xl p-6 shadow-lg">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                            {/* Search */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Search Partners</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, company, city..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    />
                                </div>
                            </div>

                            {/* State Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                                <select
                                    value={selectedState}
                                    onChange={(e) => {
                                        setSelectedState(e.target.value);
                                        setSelectedCity('All Cities');
                                    }}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    {states.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>

                            {/* City Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                                <select
                                    value={selectedCity}
                                    onChange={(e) => setSelectedCity(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                >
                                    {cities.map(city => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                            <div className="text-gray-600">
                                Showing <span className="font-semibold text-red-600">{filteredPartners.length}</span> partners
                            </div>

                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                >
                                    <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                                        <div className="bg-current rounded-sm"></div>
                                        <div className="bg-current rounded-sm"></div>
                                        <div className="bg-current rounded-sm"></div>
                                        <div className="bg-current rounded-sm"></div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'}`}
                                >
                                    <div className="w-4 h-4 flex flex-col gap-0.5">
                                        <div className="bg-current h-0.5 rounded"></div>
                                        <div className="bg-current h-0.5 rounded"></div>
                                        <div className="bg-current h-0.5 rounded"></div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Partners Directory */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {partnersByState.map(([state, statePartners]) => (
                        <div key={state} className="mb-16">
                            <div className="flex items-center mb-8">
                                <MapPin className="w-6 h-6 text-red-600 mr-3" />
                                <h2 className="text-3xl font-bold text-gray-900">{state}</h2>
                                <span className="ml-4 px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                    {statePartners.length} Partners
                                </span>
                            </div>

                            <div className={viewMode === 'grid'
                                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                : "space-y-6"
                            }>
                                {statePartners.map((partner) => (
                                    <div key={partner.id} className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${viewMode === 'list' ? 'flex items-center p-6' : 'transform hover:-translate-y-2'
                                        }`}>
                                        {viewMode === 'grid' ? (
                                            <>
                                                <div className="relative">
                                                    <img
                                                        src={partner.image}
                                                        alt={partner.name}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                    <div className="absolute top-4 right-4 flex space-x-2">
                                                        {partner.verified && (
                                                            <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                Verified
                                                            </div>
                                                        )}
                                                        <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center">
                                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                                            {partner.rating}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-900 mb-1">{partner.name}</h3>
                                                            <p className="text-red-600 font-medium">{partner.designation}</p>
                                                            <p className="text-gray-600 text-sm">{partner.company}</p>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 mb-4">
                                                        <div className="flex items-center text-gray-600">
                                                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                                                            <span className="text-sm">{partner.city}, {partner.state}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                                                            <span className="text-sm">{partner.mobile}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                                                            <span className="text-sm">{partner.email}</span>
                                                        </div>
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-4 mb-4 text-center">
                                                        <div className="bg-blue-50 rounded-lg p-3">
                                                            <div className="text-2xl font-bold text-red-600">{partner.studentsPlaced}</div>
                                                            <div className="text-xs text-gray-600">Students Placed</div>
                                                        </div>
                                                        <div className="bg-green-50 rounded-lg p-3">
                                                            <div className="text-2xl font-bold text-green-600">{partner.experience}</div>
                                                            <div className="text-xs text-gray-600">Experience</div>
                                                        </div>
                                                    </div>

                                                    <div className="mb-4">
                                                        <div className="text-sm font-medium text-gray-700 mb-2">Specializations:</div>
                                                        <div className="flex flex-wrap gap-1">
                                                            {partner.specialization.slice(0, 2).map((spec, idx) => (
                                                                <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                                    {spec}
                                                                </span>
                                                            ))}
                                                            {partner.specialization.length > 2 && (
                                                                <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                                                                    +{partner.specialization.length - 2} more
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex space-x-2">
                                                        <button 
                                                            onClick={() => handleContactNow(partner)}
                                                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                                        >
                                                            Contact Now
                                                        </button>
                                                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                                                            <ExternalLink className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex-shrink-0 mr-6">
                                                    <img
                                                        src={partner.image}
                                                        alt={partner.name}
                                                        className="w-24 h-24 rounded-xl object-cover"
                                                    />
                                                </div>

                                                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                                                    <div>
                                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{partner.name}</h3>
                                                        <p className="text-red-600 font-medium text-sm">{partner.designation}</p>
                                                        <p className="text-gray-600 text-sm">{partner.company}</p>
                                                    </div>

                                                    <div className="space-y-1">
                                                        <div className="flex items-center text-gray-600">
                                                            <MapPin className="w-3 h-3 mr-1" />
                                                            <span className="text-sm">{partner.city}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <Phone className="w-3 h-3 mr-1" />
                                                            <span className="text-sm">{partner.mobile}</span>
                                                        </div>
                                                        <div className="flex items-center text-gray-600">
                                                            <Mail className="w-3 h-3 mr-1" />
                                                            <span className="text-sm">{partner.email}</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-center">
                                                        <div className="text-lg font-bold text-red-600">{partner.studentsPlaced}</div>
                                                        <div className="text-xs text-gray-600">Students Placed</div>
                                                        <div className="flex items-center justify-center mt-1">
                                                            <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                                                            <span className="text-sm font-medium">{partner.rating}</span>
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <button 
                                                            onClick={() => handleContactNow(partner)}
                                                            className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                                                        >
                                                            Contact Now
                                                        </button>
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Partnership Benefits */}
            <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Why Partner With Us?
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Join our network of successful education consultants and help students achieve their medical education dreams
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: TrendingUp,
                                title: 'High Success Rate',
                                description: 'Our partners achieve 95%+ admission success rate with comprehensive support and guidance',
                                color: 'bg-green-500'
                            },
                            {
                                icon: Handshake,
                                title: 'Trusted Network',
                                description: 'Join a network of verified, experienced professionals with proven track records',
                                color: 'bg-blue-500'
                            },
                            {
                                icon: Target,
                                title: 'Quality Leads',
                                description: 'Receive pre-qualified student leads matching your expertise and location',
                                color: 'bg-purple-500'
                            },
                            {
                                icon: Award,
                                title: 'Recognition & Rewards',
                                description: 'Get recognized for your achievements with awards and performance-based incentives',
                                color: 'bg-orange-500'
                            },
                            {
                                icon: Shield,
                                title: 'Complete Support',
                                description: 'Access to training, marketing materials, and ongoing support from our team',
                                color: 'bg-red-500'
                            },
                            {
                                icon: Globe,
                                title: 'Global Opportunities',
                                description: 'Connect students with top medical universities across multiple countries',
                                color: 'bg-indigo-500'
                            }
                        ].map((benefit, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                                <div className={`w-16 h-16 ${benefit.color} rounded-2xl flex items-center justify-center mb-6`}>
                                    <benefit.icon className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                                <p className="text-gray-600">{benefit.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-20 bg-gradient-to-r from-red-600 to-orange-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-white">
                        <Users className="w-16 h-16 mx-auto mb-8 text-blue-200" />
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">
                            Ready to Join Our Network?
                        </h2>
                        <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
                            Become a trusted partner and help students achieve their dreams of studying medicine abroad.
                            Join our growing network of successful education consultants across India.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => setShowApplicationForm(true)}
                                className="px-8 py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-gray-100 transition-all duration-200 transform hover:scale-105"
                            >
                                Become a Partner
                            </button>
                            <button
                                onClick={() => setShowContactTeam(true)}
                                className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white hover:text-red-600 transition-all duration-200"
                            >
                                Contact Our Team
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back to Partners Button - Fixed Position */}
            <button
                onClick={() => setShowApplicationForm(false)}
                className="fixed bottom-6 right-6 bg-red-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
                title="Back to Partners Directory"
            >
                <Users className="w-6 h-6" />
            </button>

            {/* Contact Form Popup */}
            {selectedPartner && (
                <ContactFormPopup
                    isOpen={showContactForm}
                    onClose={() => {
                        setShowContactForm(false);
                        setSelectedPartner(null);
                    }}
                    partnerName={selectedPartner.name}
                    partnerCompany={selectedPartner.company}
                    partnerEmail={selectedPartner.email}
                    partnerPhone={selectedPartner.mobile}
                />
            )}
        </div>
    );
}

export default Partners;