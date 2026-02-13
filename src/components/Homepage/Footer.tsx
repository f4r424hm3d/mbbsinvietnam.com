import { GraduationCap, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const handleLinkClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const quickLinks = [
    { name: 'Universities', path: '/universities' },
    { name: 'About Kyrgyzstan', path: '/about-kyrgyzstan' },
    { name: 'Compare Universities', path: '/compare' },
    { name: 'Education System', path: '/education-system' },
    { name: 'Contact Us', path: '/contact-us' }
  ];

  const universities = [
    { name: 'American University of Central Asia', href: '/universities/american-university-of-central-asia' },
    { name: 'International School of Medicine', href: '/universities/international-higher-school-of-medicine-ihsm' },
    { name: 'Jalalabad State Medical Academy', href: '/universities/jalal-abad-state-university' },
    { name: 'Kyrgyz State Medical Academy', href: '/universities/kyrgyz-state-medical-academy-ksma' },
    { name: 'View All Universities', href: '/universities' }
  ];

  const services = [
    { name: 'Admission Assistance', href: '#' },
    { name: 'Application Guide', href: '#' },
    { name: 'Visa Support', href: '#' },
    { name: 'Accommodation Help', href: '#' },
    { name: 'Career Guidance', href: '#' }
  ];

  const resources = [
    { name: 'Application Guide', href: '#' },
    { name: 'Scholarship Guide', href: '#' },
    { name: 'Country Information', href: '#' },
    { name: 'FAQ', href: '#' },
    { name: 'Blog & News', href: '/blog-news' }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-5 gap-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Study in Kyrgyzstan</h3>
              </div>
            </div>
            {/* <p className="text-gray-400 mb-6 leading-relaxed">
              Education in Kyrgyzstan.
            </p> */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+91-11-2634-2643</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info@studyinkyrgyzstan.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-400 text-sm">New Delhi, India</span>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path} 
                    onClick={handleLinkClick}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Universities */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Top Universities</h4>
            <ul className="space-y-3">
              {universities.map((university, index) => (
                <li key={index}>
                  <a href={university.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {university.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a href={service.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Resources</h4>
            <ul className="space-y-3">
              {resources.map((resource, index) => (
                <li key={index}>
                  <a href={resource.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {resource.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
            © 2025 Study in Kyrgyzstan | Partner of Embassy of Kyrgyz Republic
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;