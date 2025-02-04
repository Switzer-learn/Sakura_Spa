import * as Components from '../../../components'

const HomePage=()=>{
    return(
        <>
          <div id="Hero" className="bg-[url('./assets/images/hero_section.webp')] h-screen bg-cover text-white">
            <Components.Header />
            <Components.Hero />
          </div>
          <div id="aboutUs" className="bg-gray-200">
            <Components.AboutUs />
          </div>
          <div className="h-screen">
            <Components.ServiceSection />
          </div>
        </>
    )
}
export default HomePage;