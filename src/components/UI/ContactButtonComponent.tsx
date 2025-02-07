interface ContactButtonComponentProps{
    href:string,
    imgUrl:string,
    alt:string,
    id:string
}

const ContactButtonComponent:React.FC<ContactButtonComponentProps>= ({href,imgUrl,alt,id}) =>{
    return(
        <div className="flex justify-center">
          <a href={href} id={id}>
            <img src={imgUrl} alt={alt} className='size-12' />
          </a>
        </div>
    )
}

export default ContactButtonComponent;