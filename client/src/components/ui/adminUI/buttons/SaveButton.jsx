import SaveIcon from '../../../../assets/icons/SaveIcon.svg';

function SaveButton({ onClick }) {
    return (
        <button 
            onClick={onClick}
            className="montserrat flex bg-[#E8F7FF] hover:bg-[#AFE5FF] px-4 py-2 2xl:px-5 2xl:py-2.5 items-center rounded-lg gap-1 2xl:gap-1.5"
        >
            <img src={SaveIcon} alt="" className="w-5 h-5 2xl:w-6 2xl:h-6"/>
            <p className="text-xs 2xl:text-sm text-[#047EAF]">Save</p>
        </button>
    )
}

export default SaveButton;


