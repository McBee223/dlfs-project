import FeaturesImage from '../../../../assets/images/FeaturesImage.png'

function FeaturesSection() {

    return (
        <section id="features" className="w-full h-fit py-24 flex justify-center bg-white">
            <div className="w-full max-w-7xl px-18">

                <div className="flex flex-col items-start text-left">

                    <p className="montserrat text-[16px] text-[#646464] mt-2 mx-4 leading-relaxed mb-6 w-140">
                        <span className="montserrat text-[16px] font-semibold text-[#323232]">
                            Simple tools for managing lost items.
                        </span> A set of simple but powerful features that help users report, track,
                        and manage lost items. Built to work together, these tools make the 
                        entire process more convenient and efficient.
                    </p>

                    <img
                        src={FeaturesImage}
                        alt="Features"
                        className="w-full object-cover rounded-lg "
                    />

                </div>
            </div>
        </section>
    )
}

export default FeaturesSection;