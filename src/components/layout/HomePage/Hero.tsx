import { Link } from "react-router-dom";
const Hero = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 mt-5 items-center px-4 md:px-10">
            {/* Left Content */}
            <div className="flex flex-col gap-4 text-center md:text-left items-center md:items-start">
                <span className="font-bold text-3xl md:text-4xl leading-tight">
                    Relax, Rejuvenate, and Renew
                </span>
                <span className="font-semibold text-xl md:text-2xl">
                    Nikmati kemewahan yang dibuat khusus untuk Anda
                </span>
                <div className="flex flex-col sm:flex-row gap-3 text-white">
                    <Link to='/Login' className="rounded-full px-5 py-3 bg-[#113307] w-full sm:w-auto">
                        BOOK AN APPOINTMENT
                    </Link>
                    <a href='#aboutUs' className="rounded-full px-5 py-3 border-white border-4 text-white w-full sm:w-auto">
                        ABOUT US
                    </a>
                </div>
            </div>

            {/* Right Image */}
            <div className="flex justify-center mt-5 md:mt-0">
                <img 
                    src="/assets/images/Sakura_Spa_Logo_noBG.webp" 
                    alt="Sakura Spa Logo" 
                    className="w-40 md:w-96 h-auto"
                />
            </div>
        </div>
    );
};

export default Hero;
