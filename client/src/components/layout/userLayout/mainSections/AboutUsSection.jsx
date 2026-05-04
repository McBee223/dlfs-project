import AboutUseImage from '../../../../assets/images/AboutUseImage.png'

function AboutUsSection() {

    return (
        <section className="w-full h-fit py-24 bg-white">

            <div className="relative z-20 w-full max-w-7xl mx-10 px-15 grid grid-cols-2 items-center">

                <div className="col-span-2 flex flex-col items-center text-center">

                    <h2
                        className="montserrat text-6xl text-[#323232] font-semibold mb-4"
                    >
                        Turning Lost Into Found
                    </h2>

                    <p
                        className="montserrat max-w-3xl text-sm text-[#646464] leading-relaxed"
                    >
                        We are committed to creating a simple and reliable Lost & Found system
                        that helps connect people with their missing belongings. Our goal is to
                        make reporting, tracking, and claiming lost items easier for everyone.
                        By providing clear updates and organized information, we aim to improve
                        how lost items are managed within the STI College Sta. Maria community.
                        Through this system, we hope to make the process faster, more transparent,
                        and more convenient for all users.
                    </p>

                    <img src={AboutUseImage} alt="" />

                </div>

            </div>

        </section>
    )
}

export default AboutUsSection;