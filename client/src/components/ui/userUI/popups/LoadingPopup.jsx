function LoadingPopup() {
    return (
        <div className="fixed inset-0 justify-center z-999 flex bg-black/30">
            <div className="bg-white w-fit h-fit mt-7 rounded-2xl px-10 py-8 2xl:px-14 2xl:py-10 shadow-lg">
                <div className="flex gap-4">
                    <span className="w-3 h-3 2xl:w-4 2xl:h-4 bg-[#0E7490] rounded-full animate-dot1"></span>
                    <span className="w-3 h-3 2xl:w-4 2xl:h-4 bg-[#0E7490] rounded-full animate-dot2"></span>
                    <span className="w-3 h-3 2xl:w-4 2xl:h-4 bg-[#0E7490] rounded-full animate-dot3"></span>
                </div>
            </div>
        </div>
    );
}

export default LoadingPopup;