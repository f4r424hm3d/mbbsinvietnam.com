import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AboutUniversity from './components/AboutUniversity';
import Facilities from './components/Facilities';
import Rankings from './components/Rankings';
import InternationalStudents from './components/InternationalStudents';
import ApplicationForm from './components/ApplicationForm';
import ApplicationProcedure from './components/ApplicationProcedure';
import ParentTestimonials from './components/ParentTestimonials';
import RatingsReviews from './components/RatingsReviews';
import CampusPhotos from './components/CampusPhotos';
import FAQ from './components/FAQ';
import TrustSeals from './components/TrustSeals';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Hero />
      <AboutUniversity />
      <Facilities />
      <CampusPhotos />
      <Rankings />
      <InternationalStudents />
      <ParentTestimonials />
      <RatingsReviews />
      <ApplicationForm />
      <ApplicationProcedure />
      <FAQ />
      <TrustSeals />
      <Footer />
    </div>
  );
}

export default App;