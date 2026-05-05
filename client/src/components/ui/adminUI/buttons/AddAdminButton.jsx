import AddIcon from "../../../../assets/icons/AddIcon.svg";

function AddAdminButton({ onClick }) {
    return (
        <button onClick={onClick} className="flex items-center gap-2 bg-[#D0EDFB] hover:bg-[#AFE5FF] px-4 py-2.5 2xl:px-5 2xl:py-3 rounded-lg montserrat">
            <img src={AddIcon} alt="" className="w-3 h-3 2xl:w-4 2xl:h-4" />
            <p className="text-xs 2xl:text-sm text-[#047EAF]">Add Admin</p>
        </button>
    );
}

export default AddAdminButton;


