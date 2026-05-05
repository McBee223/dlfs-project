import DeleteIcon from '../../../../assets/icons/DeleteIcon.svg'

function DeleteButton({ onClick }) {
    return (
        <button
            onClick={onClick}
            className="montserrat flex bg-[#E8F7FF] hover:bg-[#AFE5FF] px-4 py-2 2xl:px-5 2xl:py-3 items-center rounded-lg gap-1"
        >
            <img src={DeleteIcon} alt="" className='w-5 h-5 2xl:w-6 2xl:h-6' />
            <p className='text-xs 2xl:text-sm text-[#047EAF]'>Delete</p>
        </button>
    )
}

export default DeleteButton;    




