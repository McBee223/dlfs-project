import TopBar from "../../components/layout/adminLayout/fixedLayout/TopBar";
import AdminProfileMainLayout from "../../components/layout/adminLayout/mainLayouts/AdminProfileMainLayout";
import RightBar from "../../components/layout/adminLayout/fixedLayout/RightBar"

function AdminProfile() {

    return (
        <div className="ml-2">
            <TopBar
                title="Admin's Profile"
                bg="white"
                iconbg="bg-[#F9F9F9]"
                showActions={true}
            />

            <div className="flex flex-1">
                <AdminProfileMainLayout />
                <RightBar />
            </div>
        </div>
    )
}

export default AdminProfile;



