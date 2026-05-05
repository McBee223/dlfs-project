import FeaturesImage from '../../../../assets/images/FeaturesImage.png'

function FeaturesSection() {

    return (
        <section id="features" className="w-full h-fit py-24 flex justify-center 2xl:justify-between bg-white">
            <div className="w-full max-w-none">

                <div className="flex flex-col items-start text-left px-20 2xl:px-30">

                    <p className="montserrat text-base 2xl:text-xl text-[#646464] mt-2 mx-4 leading-relaxed mb-6 w-140 2xl:w-175">
                        <span className="montserrat text-base 2xl:text-xl font-semibold text-[#323232]">
                            Simple tools for managing lost items.
                        </span> A set of simple but powerful features that help users report, track,
                        and manage lost items. Built to work together, these tools make the 
                        entire process more convenient and efficient.
                    </p>

                    <img
                        src={FeaturesImage}
                        alt="Features"
                        className="w-full 2xl:w-full object-cover rounded-lg "
                    />

                </div>
            </div>
        </section>
    )
}

export default FeaturesSection;



