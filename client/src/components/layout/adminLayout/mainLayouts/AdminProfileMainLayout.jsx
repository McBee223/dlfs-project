import AdminProfileDetails from "../../../ui/adminUI/AdminProfileDetails";
import AdminPersonalInformation from "../../../ui/adminUI/AdminPersonalInformation";

function AdminProfileMainLayout() {



    return (
        <div className="flex-1 w-200 ">
            <div >
                <AdminProfileDetails />
                <div className="w-full my-2">
                    <AdminPersonalInformation />
                </div>
            </div>
        </div>
    )
}

export default AdminProfileMainLayout;




