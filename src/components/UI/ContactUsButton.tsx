import ContactButtonComponent from './ContactButtonComponent'
import { useState } from 'react'

const ContactUsButton = () =>{
    const [contactOpen,setContactOpen] = useState(false);

    return(
      <div className="fixed bottom-0 right-0" id="contactIcon">
        <div className="mb-12 mx-12">
            {contactOpen&&(
                <div className="flex flex-col opacity-80 text-center justify-center gap-2 py-4 bg-white rounded-full" id="contactMeChoice">
                    <ContactButtonComponent 
                        imgUrl='/assets/images/icons8-whatsapp.gif' 
                        alt='whatsapp logo' 
                        href='https://wa.me/+6285183266288'
                        id='whatsapp'
                    />
                    <ContactButtonComponent 
                        imgUrl='/assets/images/icons8-instagram.gif' 
                        alt='instagram logo' 
                        href='https://www.instagram.com/sakurafamilyspa_banyuwangi'
                        id='instagram'
                    />
                </div>
            )}
            <div className="py-2 px-3 rounded-lg border-2 shadow-lg bg-[#0d1821ff]" id="contactMe" >
                <button className="text-white" onClick={()=>setContactOpen(!contactOpen)}>Contact Us</button>
            </div>
        </div>
      </div>
    )
}

export default ContactUsButton;