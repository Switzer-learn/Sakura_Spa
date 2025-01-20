import React from 'react';

type HeaderProps = {
  title: string;
  subtitle: string;
};

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="bg-pink-200 text-center py-8">
      <h1 className="text-4xl font-bold text-gray-800">{title}</h1>
      <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
    </header>
  );
};

export default Header;
