import Header from "../layout/Header";
import Hero from "../layout/Hero";
import AboutUs from "../layout/AboutUs";

const HomePage=()=>{
    return(
        <>
          <div id="Hero" className="bg-[url('./assets/images/hero_section.webp')] h-screen bg-cover text-white">
            <Header />
            <Hero />
          </div>
          <div id="aboutUs" className="bg-[url('./assets/images/about_us.webp')] h-screen bg-cover bg-center text-gray-700">
            <AboutUs />
          </div>
        </>
    )
}
export default HomePage;