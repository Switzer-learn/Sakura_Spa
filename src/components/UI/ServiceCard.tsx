import React from 'react';

type ServiceCardProps = {
  title: string;
  duration: [];
  description: string;
};

const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  duration,
  description,
}) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6 text-center">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-gray-600 mt-2">Durasi: {duration.map((duration)=>(
        <span>{duration} </span>
      ))} menit </p>
      <p className="text-gray-600 mt-2">{description}</p>
      
    </div>
  );
};

export default ServiceCard;
