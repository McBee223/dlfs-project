import EditIcon from '../../../../assets/icons/EditIcon.svg';

function EditButton({ onClick }) {
    return (
        <button 
            onClick={onClick}
            className="montserrat flex bg-[#E8F7FF] hover:bg-[#AFE5FF] px-4 py-2 items-center rounded-lg gap-1"
        >
            <img src={EditIcon} alt="" className='w-5 h-5'/>
            <p className='text-xs text-[#047EAF]'>Edit</p>
        </button>
    )
}

export default EditButton;