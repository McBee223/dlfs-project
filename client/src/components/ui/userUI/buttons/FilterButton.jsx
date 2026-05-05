import FilterIcon from '../../../../assets/icons/FilterIcon.svg';

function FilterButton({ onClick, active }) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                onClick();
            }}
            className={`montserrat flex px-4 py-2 2xl:px-5 2xl:py-3 items-center rounded-lg gap-1
                ${active ? "bg-white" : "bg-[#E8F7FF] hover:bg-[#AFE5FF]"}
            `}
        >
            <img src={FilterIcon} alt="" className="w-5 h-5 2xl:w-6 2xl:h-6" />
            <p className="text-xs 2xl:text-base text-[#047EAF]">Filter</p>
        </button>
    )
}

export default FilterButton;

