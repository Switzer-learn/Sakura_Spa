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
      ))}</p>
      <p className="text-gray-600 mt-2">{description}</p>
      <button className="mt-4 bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600">
        Pelajari Lebih
      </button>
    </div>
  );
};

export default ServiceCard;
