import React, { useState, useEffect } from 'react';
import ServiceCard from '../../UI/ServiceCard';
import { api } from '../../../services/api';

const ServiceSection = () => {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.getServices();
        if (response) {
          const groupedServices = response.reduce((acc, service) => {
            let serviceTypeGroup = acc.find(group => group.service_type === service.service_type);
            if (!serviceTypeGroup) {
              serviceTypeGroup = { 
                service_type: service.service_type, 
                data: [] 
              };
              acc.push(serviceTypeGroup);
            }
          
            let serviceGroup = serviceTypeGroup.data.find(item => item.service_name === service.service_name);
            if (!serviceGroup) {
              serviceGroup = {
                service_name: service.service_name,
                service_duration: [],
                service_price: service.service_price,
                description: service.keterangan
              };
              serviceTypeGroup.data.push(serviceGroup);
            }
          
            if (!serviceGroup.service_duration.includes(service.service_duration)) {
              serviceGroup.service_duration.push(service.service_duration);
            }
          
            return acc;
          }, []);
          
          setServices(groupedServices);
        }
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  return (
    <section className="bg-gray-100 py-16 px-8">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-5">
        Our Services
      </h2>

      {services.map((service, index) => (
        <div key={index} className="mb-8">
          {/* Service Type Button */}
          <button
            onClick={() => console.log(`${service.service_type} clicked`)}
            className="w-full rounded-xl h-48 px-5 flex items-end bg-cover bg-center"
            style={{ backgroundImage: "url('/assets/images/relaxing-massage.webp')" }}
            aria-label={service.service_type}
          >
            <p className="text-xl font-bold text-white bg-black bg-opacity-50 p-2 rounded">
              {service.service_type}
            </p>
          </button>

          {/* Services List */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {service.data.map((serviceItem, subIndex) => (
              <ServiceCard
                key={subIndex}
                title={serviceItem.service_name}
                duration={serviceItem.service_duration}
                description={serviceItem.description}
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ServiceSection;
