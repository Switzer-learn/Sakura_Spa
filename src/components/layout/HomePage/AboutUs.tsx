import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section className="py-16 px-4 md:px-8 bg-[url('./assets/images/about_us.webp')] h-screen bg-cover bg-center text-gray-700">
      <h2 className="text-3xl font-semibold text-gray-800 shadow-sm text-center mb-6 underline">
        About Us
      </h2>
      <div className="flex flex-col gap-5 items-center text-center md:text-start md:items-start">
        <p className="leading-relaxed w-full md:w-4/6 lg:w-3/5">
          Selamat datang di Sakura Spa, tempat terbaik untuk relaksasi,
          peremajaan, dan pembaruan diri Anda. Terinspirasi oleh keindahan dan
          ketenangan bunga sakura, kami menghadirkan pendekatan holistik untuk
          kebugaran yang menyelaraskan tubuh dan pikiran Anda.
        </p>
        <p className="leading-relaxed w-full md:w-4/6 lg:w-3/5">
          Di Sakura Spa, kami percaya pada kekuatan alam dan seni penyembuhan.
          Perawatan kami dirancang untuk menyentuh seluruh indra Anda,
          menggabungkan teknik tradisional dengan inovasi modern untuk memberikan pengalaman yang benar-benar mewah.
          Mulai dari pijat yang menenangkan, perawatan wajah yang menyegarkan,
          hingga perawatan tubuh yang memanjakan, setiap layanan kami disesuaikan dengan kebutuhan unik Anda.
        </p>
        <p className="leading-relaxed w-full md:w-3/6 lg:w-2/5">
          Masuki oasis ketenangan kami,
          di mana aroma yang menenangkan, terapis berpengalaman,
          dan suasana hangat membawa Anda ke dunia yang penuh kedamaian dan harmoni.
          Baik Anda ingin melepas penat setelah hari yang panjang atau merayakan momen spesial,
          Sakura Spa siap menjadikan setiap kunjungan Anda luar biasa.
        </p>
        <p className="leading-relaxed w-full md:w-2/6 lg:w-1/3">
          Temukan kembali keseimbangan, keindahan,
          dan kebahagiaan Anda di Sakura Spa—tempat di mana kesejahteraan Anda bermekaran.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
