import Header from './components/Homepage/Header';
import Hero from './components/Homepage/Hero';
import UniversityGrid from './components/Homepage/UniversityGrid';
import AboutKyrgyzstan from './components/Homepage/AboutKyrgyzstan';
import CompareUniversities from './components/Homepage/CompareUniversities';
import Scholarships from './components/Homepage/Scholarships';
import EducationSystem from './components/Homepage/EducationSystem';
import MinistryLinks from './components/Homepage/MinistryLinks';
import Footer from './components/Homepage/Footer';
import { Routes, Route, useLocation } from 'react-router-dom';
import UniversityDetail from './components/university/UniversityDetail';
import Scholarshipmain from './components/Scholarships/schloshipmain';
import UniversityList from './components/university/UniversityList';

import ScolarshipDetail from './components/Scholarships/ScholarshipsDetail';
import EducationSystemNav from './components/Pages/EducationSystemNav';
import AboutKyrgyzstanNav from './components/Pages/AboutKyrgyzstanNav';
import AboutUs from './components/Pages/AboutUs';
import ContactTeam from './components/Pages/OurPartners/ContactTeam';
import Signup from './components/Auth/Signup';
import OTPVerification from './components/Auth/OTPVerification';
import PasswordReset from './components/Auth/PasswordReset';

import Partners from './components/Pages/OurPartners/Partners';

import StudentDashboard from './components/Pages/Student/StudentDashboard';
import AppliedColleges from './components/Pages/Student/AppliedColleges';
import ChangePassword from './components/Pages/Student/ChangePassword';
import AccountSettings from './components/Pages/Student/AccountSettings';
import AgentDashboard from './components/Pages/Agent/AgentDashboard';
import BlognewsMain from './components/Pages/Blog&News/BlogNewsMain';
import ApplicationForm from './components/Pages/Student/ApplicationForm';
import { MBBSCoursePage } from './components/university/UniversityCourses/MBBSCoursePage';
import PasswordResetStatic from './components/Pages/PasswordResetStatic';



function App(): JSX.Element {
  console.log("App component rendering...");
  const location = useLocation();
  const isStudentDashboard = location.pathname === '/student-dashboard' || location.pathname.startsWith('/student-dashboard/');
  const isAuthPage = location.pathname.startsWith('/auth');
  
  return (
    <div className="min-h-screen bg-white">
      {!isStudentDashboard && !isAuthPage && <Header />}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <UniversityGrid />
              <AboutKyrgyzstan />
              <CompareUniversities />
              <Scholarships />
              <EducationSystem />
              <MinistryLinks />
            </>
          }
        />
        <Route path="/universities/:slug" element={<UniversityDetail />} />
        <Route path="/scholarships" element={<Scholarshipmain />} />
        <Route path="/universities" element={<UniversityList />} />
        <Route path="/education-system" element={<EducationSystemNav />} />
        <Route path="/compare" element={<CompareUniversities />} />
        <Route path="/about-kyrgyzstan" element={<AboutUs />} />
        <Route path="/about-us" element={<AboutKyrgyzstanNav />} />
        
        <Route path="/contact-us" element={<ContactTeam />} />
        <Route path="/auth" element={<Signup />} />
        <Route path="/auth/otp-verification" element={<OTPVerification />} />
        <Route path="/auth/password/reset" element={<PasswordReset />} />
        <Route path="/password/reset" element={<PasswordResetStatic />} />

        <Route path="/our-partners" element={<Partners />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-dashboard/applied-college" element={<AppliedColleges />} />
        <Route path="/student-dashboard/change-password" element={<ChangePassword />} />
        <Route path="/student-dashboard/account-setting" element={<AccountSettings />} />

        <Route path='/agent-dashboard' element={<AgentDashboard />} />
        <Route path="/scholarships/:universityId/:scholarshipId" element={<ScolarshipDetail />} />
        <Route path="/scholarships/:slug" element={<ScolarshipDetail />} />
        <Route path="/blog" element={<BlognewsMain />} />
        <Route path="/blog/:categorySlug" element={<BlognewsMain />} />
        <Route path="/blog/:categorySlug/:slug" element={<BlognewsMain />} />
        <Route path="/blog-news" element={<BlognewsMain />} />
        <Route path="/blog-news/:categorySlug" element={<BlognewsMain />} />
        <Route path="/blog-news/:categorySlug/:slug" element={<BlognewsMain />} />
        <Route path="/blog-article" element={<BlognewsMain />} />
        <Route path="/blog-article/:categorySlug" element={<BlognewsMain />} />
        <Route path="/blog-article/:categorySlug/:slug" element={<BlognewsMain />} />
        <Route
          path="/student/application-form"
          element={
            <ApplicationForm onApplicationSubmit={(applicationData) => {
              // handle application submission here
              console.log('Application submitted:', applicationData);
            }} />
          }
        />
         <Route path='/universities/:slug/mbbscourses/:programSlug' element={<MBBSCoursePage />} />
         <Route path='/universities/:slug/mbbscourses' element={<MBBSCoursePage />} />

      </Routes>
      {!isStudentDashboard && !isAuthPage && <Footer />}
    </div>
  );
}

export default App;
