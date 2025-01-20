import React from 'react';

const AboutUs: React.FC = () => {
  return (
    <section className="py-16 px-8">
      <h2 className="text-3xl font-semibold text-gray-800 shadow-sm text-center">About Us</h2>
      <div className="flex flex-col gap-5 mt-3">
        <p className="leading-relaxed w-4/6">
          Selamat datang di Sakura Spa, tempat terbaik untuk relaksasi,
          peremajaan, dan pembaruan diri Anda. Terinspirasi oleh keindahan dan
          ketenangan bunga sakura, kami menghadirkan pendekatan holistik untuk
          kebugaran yang menyelaraskan tubuh dan pikiran Anda.
        </p>
        <p className="leading-relaxed w-4/6">
          Di Sakura Spa, kami percaya pada kekuatan alam dan seni penyembuhan. 
          Perawatan kami dirancang untuk menyentuh seluruh indra Anda, 
          menggabungkan teknik tradisional dengan inovasi modern untuk memberikan pengalaman yang benar-benar mewah. 
          Mulai dari pijat yang menenangkan, perawatan wajah yang menyegarkan, 
          hingga perawatan tubuh yang memanjakan, 
          setiap layanan kami disesuaikan dengan kebutuhan unik Anda.
        </p>
        <p className="leading-relaxed w-3/6">
          Masuki oasis ketenangan kami, 
          di mana aroma yang menenangkan, terapis berpengalaman, 
          dan suasana hangat membawa Anda ke dunia yang penuh kedamaian dan harmoni. 
          Baik Anda ingin melepas penat setelah hari yang panjang atau merayakan momen spesial, 
          Sakura Spa siap menjadikan setiap kunjungan Anda luar biasa.
        </p>
        <p className="leading-relaxed w-2/6">
          Temukan kembali keseimbangan, keindahan, 
          dan kebahagiaan Anda di Sakura Spa—tempat di mana kesejahteraan Anda bermekaran.
        </p>
      </div>
    </section>
  );
};

export default AboutUs;
