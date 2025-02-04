import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ServiceCard from '../../UI/ServiceCard';
import { api } from '../../../services/api';

const ServiceSection = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await api.getServices();
        if (response) {
          const groupedServices = response.reduce((acc, service) => {
            let serviceTypeGroup = acc.find(group => group.service_type === service.service_type);
            if (!serviceTypeGroup) {
              serviceTypeGroup = { service_type: service.service_type, data: [] };
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
        console.error('Error fetching services:', error);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };
    fetchServices();
  }, []);

  const toggleService = (index: number) => {
    setActiveIndex(prevIndex => (prevIndex === index ? null : index));
  };

  const getImageUrl = (n: number) => `url('/assets/images/${(n % 6) + 1}.webp')`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <img src="./Sakura_Spa_Logo.png" alt="Loading..." className="w-32 h-32 animate-pulse" />
      </div>
    );
  }

  return (
    <section className="bg-gray-100 mt-28 lg:mt-0 lg:py-16 px-8 bg-gradient-to-br from-green-700 to-green-500" id='serviceSection'>
      <h2 className="text-3xl font-semibold text-center text-gray-100 mb-5 underline">Our Services</h2>
      {services.map((service, index) => (
        <div key={index} className="mb-8">
          <button
            onClick={() => toggleService(index)}
            className="w-full rounded-xl h-48 px-5 flex items-end bg-cover bg-center"
            style={{ backgroundImage: getImageUrl(index) }}
            aria-label={service.service_type}
          >
            <p className="text-xl font-bold text-white bg-black bg-opacity-50 p-2 rounded">
              {service.service_type}
            </p>
          </button>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: activeIndex === index ? 'auto' : 0, opacity: activeIndex === index ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            className="overflow-hidden"
          >
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
          </motion.div>
        </div>
      ))}
      <div className="flex justify-center mt-12">
        <button className="bg-blue-600 text-green-700 px-6 py-3 rounded-lg text-lg font-bold hover:bg-blue-700 transition-all">
          Book Your Schedule Now
        </button>
      </div>
    </section>
  );
};

export default ServiceSection;
