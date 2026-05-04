import EmojiBlue from '../../../../assets/images/EmojiBlue.png'

function ClaimSuccesPopup({ onClose }) {

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-9999">
            <div className="bg-white w-80 rounded-2xl shadow-lg p-6 text-center">

                <div className="flex justify-center mb-4">
                    {EmojiBlue ? (
                        <img src={EmojiBlue} alt="emoji" className="w-40 h-auto" />
                    ) : (
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-gray-400 text-sm">Emoji</span>
                        </div>
                    )}
                </div>

                <h2 className="text-xl font-semibold text-gray-700 mb-2">
                    Claim request submitted!
                </h2>

                <p className="text-sm text-gray-500 mb-5">
                    Your review helps us make the Lost & Found experience better for all users.
                </p>

                <button
                    onClick={onClose}
                    className="w-full text-[#969696] py-2 rounded-sm font-medium transition"
                >
                    Done
                </button>

            </div>
        </div>
    )
}

export default ClaimSuccesPopup;