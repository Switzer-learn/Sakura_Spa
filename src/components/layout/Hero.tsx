const Hero = () =>{
    return (
        <div className="grid grid-cols-2 mt-5">
            <div className="flex flex-col gap-2 px-10 justify-center">
                <span className="font-bold text-4xl">Relax, Rejuvenate, and Renew</span>
                <span className="font-bold text-2xl">Nikmati kemewahan yang dibuat khusus untuk anda</span>
                <div className="flex gap-2 text-white">
                    <button className="rounded-full px-3 py-2 bg-[#113307]">BOOK AN APPOINTMENT</button>
                    <button className="rounded-full px-3 py-2 border-white border-4">ABOUT US</button>
                </div>
            </div>
            <div>
                <img src="./assets/images/Sakura_Spa_Logo_noBG.webp" alt="Sakura Spa Logo" className="size-96 flex justify-center mx-auto" />
            </div>
        </div>
    )
}

export default Hero;