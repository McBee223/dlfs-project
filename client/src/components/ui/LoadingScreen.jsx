function LoadingScreen({ message = "Loading..." }) {
    return (
        <div className="fixed inset-0 bg-black/50 z-9999 flex flex-col items-center justify-center gap-4 montserrat">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
            <p className="text-white font-semibold text-sm">{message}</p>
        </div>
    );
}

export default LoadingScreen;