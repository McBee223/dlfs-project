function RoleCard({ icon, label, onClick }) {
    return (
        <div
            onClick={onClick}
            className="montserrat bg-white border border-gray-100 rounded-2xl 2xl:rounded-3xl
                       p-8 2xl:p-10 w-40 2xl:w-52 flex flex-col items-center gap-5 2xl:gap-6
                       cursor-pointer hover:border-[#047EAF] transition-colors duration-150"
        >
            <div className="w-20 h-20 2xl:w-24 2xl:h-24 rounded-full bg-gray-100 2xl:bg-gray-100
                            flex items-center justify-center overflow-hidden">
                {icon}
            </div>
            <p className="text-sm 2xl:text-base font-medium text-gray-700 text-center">
                {label}
            </p>
        </div>
    );
}

export default RoleCard;