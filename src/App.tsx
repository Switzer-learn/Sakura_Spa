import React from 'react';
import Header from './components/layout/Header';
import AboutUs from './components/AboutUs';
import ServiceSection from './components/layout/ServiceSection';

const App: React.FC = () => {
  return (
    <div className="font-sans">
      <Header
        title="Relax, Rejuvenate, and Renew"
        subtitle="Nikmati kemewahan yang dibuat khusus untuk Anda"
      />
      <AboutUs />
      <ServiceSection />
    </div>
  );
};

export default App;
