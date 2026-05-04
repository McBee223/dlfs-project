import AddIcon from "../../../../assets/icons/AddIcon.svg";

function AddAdminButton({ onClick }) {
    return (
        <button onClick={onClick} className="flex items-center gap-2 bg-[#D0EDFB] hover:bg-[#AFE5FF] px-4 py-2.5 rounded-lg montserrat">
            <img src={AddIcon} alt="" className="w-3 h-3" />
            <p className="text-xs text-[#047EAF]">Add Admin</p>
        </button>
    );
}

export default AddAdminButton;