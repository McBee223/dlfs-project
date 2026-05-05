import TopBar from "../../components/layout/adminLayout/fixedLayout/TopBar";
import AdminItemsManagementMainLayout from "../../components/layout/adminLayout/mainLayouts/AdminItemsManagementMainLayout";

function AdminItemsManagement() {

    return (
        <div className="bg-white h-screen">
            <TopBar
                title="Items Management"
                bg="white"
                iconbg="bg-[#F9F9F9]"
                showActions={false}
            />

            <div className="flex flex-1 bg-white">
                <AdminItemsManagementMainLayout />
            </div>
        </div>
    )
}

export default AdminItemsManagement;



