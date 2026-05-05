import EmojiBlue from '../../../../assets/images/EmojiBlue.png'

function ClaimSuccesPopup({ onClose }) {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-9999">
            <div className="bg-white w-80 2xl:w-100 rounded-2xl shadow-lg px-6 py-6 2xl:p-7 text-center justify-center">

                <div className="flex justify-center mb-4">
                    {EmojiBlue ? (
                        <img src={EmojiBlue} alt="emoji" className="w-40 2xl:w-60 h-auto" />
                    ) : (
                        <div className="w-24 h-24 2xl:w-25 2xl:h-25 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-400 text-sm 2xl:text-base">Emoji</span>
                        </div>
                    )}
                </div>

                <h2 className="text-2xl 2xl:text-4xl font-semibold text-gray-700 mb-2 2xl:mb-3 2xl:px-8  ">
                    Claim request submitted!
                </h2>

                <p className=" text-sm 2xl:text-lg text-gray-500 mb-5">
                    Please wait while we review your request.
                </p>

                <button
                    onClick={onClose}
                    className="w-full text-[#969696] py-2 2xl:text-lg rounded-sm font-medium transition"
                >
                    Done
                </button>

            </div>
        </div>
    )
}

export default ClaimSuccesPopup;


