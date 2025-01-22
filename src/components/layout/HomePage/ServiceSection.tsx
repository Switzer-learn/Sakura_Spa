import React from 'react';
import ServiceCard from '../../UI/ServiceCard';

const ServiceSection: React.FC = () => {
  const services = [
    {
      title: 'Traditional Massage',
      duration: '90-120 menit',
      description:
        'Pijat Aromaterapi, Pijat Hot Stone, Pijat Refleksi Kaki, Pijat Deep Tissue.',
    },
    // Add more services here as needed
  ];

  return (
    <section className="bg-gray-100 py-16 px-8">
      <h2 className="text-3xl font-semibold text-center text-gray-800">
        Our Services
      </h2>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <ServiceCard
            key={index}
            title={service.title}
            duration={service.duration}
            description={service.description}
          />
        ))}
      </div>
    </section>
  );
};

export default ServiceSection;
