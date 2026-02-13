import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, GraduationCap, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MenuItem {
  name: string;
  path: string;
}

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userInitials, setUserInitials] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const resourcesMenu: MenuItem[] = [
    { name: 'About Us', path: '/about-us' },
    { name: 'Contact Us', path: '/contact-us' },
    { name: 'About Kyrgyzstan', path: '/about-kyrgyzstan' },
    { name: 'Education System', path: '/education-system' },
    { name: 'View Our Partners', path: '/our-partners' },
    { name: 'Blog & News', path: '/blog-news' },
  ];

  const handleNavClick = () => {
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  const handleUniversitiesClick = () => {
    // Scroll to top when Universities link is clicked
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsMenuOpen(false);
    setActiveDropdown(null);
  };

  // Function to get user initials from name
  const getInitials = (name: string): string => {
    if (!name) return '';
    const nameParts = name.trim().split(/\s+/);
    if (nameParts.length >= 2) {
      // First letter of first name + first letter of last name
      return (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase();
    } else if (nameParts.length === 1) {
      // Single name - use first two letters
      return nameParts[0].substring(0, 2).toUpperCase();
    }
    return '';
  };

  // Check if user is logged in and get initials
  useEffect(() => {
    const token = localStorage.getItem('studentToken') || localStorage.getItem('authToken');
    const studentId = localStorage.getItem('studentId');
    const studentName = localStorage.getItem('studentName');
    
    if (token || studentId) {
      setIsLoggedIn(true);
      if (studentName) {
        setUserInitials(getInitials(studentName));
      } else {
        // Fallback: try to get initials from email
        const email = localStorage.getItem('studentEmail') || '';
        if (email) {
          setUserInitials(email.substring(0, 2).toUpperCase());
        }
      }
    } else {
      setIsLoggedIn(false);
      setUserInitials('');
    }

    // Listen for storage changes (e.g., logout in another tab)
    const handleStorageChange = () => {
      const newToken = localStorage.getItem('studentToken') || localStorage.getItem('authToken');
      const newStudentId = localStorage.getItem('studentId');
      const newStudentName = localStorage.getItem('studentName');
      
      if (newToken || newStudentId) {
        setIsLoggedIn(true);
        if (newStudentName) {
          setUserInitials(getInitials(newStudentName));
        }
      } else {
        setIsLoggedIn(false);
        setUserInitials('');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-2">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Study in Kyrgyzstan</h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Home
            </Link>
            <Link 
              to="/universities" 
              onClick={handleUniversitiesClick}
              className="text-gray-700 hover:text-red-600 font-medium transition-colors"
            >
              Universities
            </Link>
            <Link to="/compare" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Compare Universities
            </Link>
            <Link to="/scholarships" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
              Scholarships
            </Link>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 text-gray-700 hover:text-red-600 font-medium transition-colors">
                <span>Resources</span>
                <ChevronDown className="w-4 h-4 " />
              </button>

              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-0 w-60 bg-white shadow-xl rounded-lg mt-0 p-4 border">
                  <ul className="space-y-2">
                    {resourcesMenu.map((item, index) => (
                      <li key={index}>
                        <Link
                          to={item.path}
                          className="block text-gray-600 hover:text-red-600 text-sm transition-colors"
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {isLoggedIn ? (
              <Link
                to="/student-dashboard"
                className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold hover:bg-red-700 transition-colors"
                aria-label="Go to dashboard"
              >
                {userInitials || <User className="w-5 h-5" />}
              </Link>
            ) : (
              <Link
                to="/auth"
                className="bg-red-600 text-white px-9 py-2 rounded-lg hover:bg-red-700 transition-colors "
              >
                Sign-Up
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t">
            <nav className="space-y-4">
              <Link to="/" onClick={handleNavClick} className="block text-gray-700 hover:text-red-600 font-medium">
                Home
              </Link>
              <Link to="/universities" onClick={handleUniversitiesClick} className="block text-gray-700 hover:text-red-600 font-medium">
                Universities
              </Link>
              <Link to="/compare" onClick={handleNavClick} className="block text-gray-700 hover:text-red-600 font-medium">
                Compare Universities
              </Link>
              <Link to="/scholarships" onClick={handleNavClick} className="block text-gray-700 hover:text-red-600 font-medium">
                Scholarships
              </Link>

              {/* Resources dropdown in mobile */}
              <div>
                <button
                  className="flex items-center justify-between w-full text-gray-700 hover:text-red-600 font-medium"
                  onClick={() =>
                    setActiveDropdown(activeDropdown === 'resources' ? null : 'resources')
                  }
                >
                  <span>Resources</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {activeDropdown === 'resources' && (
                  <div className="mt-2 pl-4 space-y-2">
                    {resourcesMenu.map((item, index) => (
                      <Link
                        key={index}
                        to={item.path}
                        onClick={handleNavClick}
                        className="block text-gray-600 hover:text-red-600 text-sm transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {isLoggedIn ? (
                <Link
                  to="/student-dashboard"
                  onClick={handleNavClick}
                  className="block bg-gray-100 text-gray-700 px-4 py-2 rounded-lg text-center hover:bg-gray-200 transition-colors"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {userInitials || <User className="w-4 h-4" />}
                    </div>
                    <span>Dashboard</span>
                  </div>
                </Link>
              ) : (
                <Link
                  to="/auth"
                  onClick={handleNavClick}
                  className="block bg-red-600 text-white px-4 py-2 rounded-lg text-center"
                >
                  Sign-Up
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;