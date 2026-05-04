import SaveIcon from '../../../../assets/icons/SaveIcon.svg';

function SaveButton({ onClick }) {
    return (
        <button 
            onClick={onClick}
            className="montserrat flex bg-[#E8F7FF] hover:bg-[#AFE5FF] px-4 py-2 items-center rounded-lg gap-1"
        >
            <img src={SaveIcon} alt="" className="w-5 h-5"/>
            <p className="text-xs text-[#047EAF]">Save</p>
        </button>
    )
}

export default SaveButton;