import { lazy, Suspense } from 'react';

const Header = lazy(() => import('../../layout/HomePage/Header'));
const Hero = lazy(() => import('../../layout/HomePage/Hero'));
const AboutUs = lazy(() => import('../../layout/HomePage/AboutUs'));
const ServiceSection = lazy(() => import('../../layout/HomePage/ServiceSection'));
const ContactUsButton = lazy(() => import('../../UI/ContactUsButton'));

const HomePage = () => {
    return (
        <>
            <div id="Hero" className="bg-[url('/assets/images/hero_section.webp')] h-screen bg-cover text-white">
                <Suspense fallback={<div>Loading Header...</div>}>
                    <Header customerMode={true} />
                </Suspense>
                <Suspense fallback={<div>Loading Hero...</div>}>
                    <Hero />
                    <ContactUsButton />
                </Suspense>
            </div>
            <div id="aboutUs" className="bg-gray-200">
                <Suspense fallback={<div>Loading About Us...</div>}>
                    <AboutUs />
                </Suspense>
            </div>
            <div className="h-screen">
                <Suspense fallback={<div>Loading Services...</div>}>
                    <ServiceSection />
                </Suspense>
            </div>
        </>
    );
};

export default HomePage;
