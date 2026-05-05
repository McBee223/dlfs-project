function LoadingScreen({ message = "Loading..." }) {
    return (
        <div className="fixed inset-0 bg-black/50 z-9999 flex flex-col items-center justify-center gap-4 montserrat">
            <div className="w-12 h-12 2xl:w-15 2xl:h-15 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-white font-semibold text-sm 2xl:text-lg">{message}</p>
        </div>
    );
}

export default LoadingScreen;