import TopBar from "../../components/layout/adminLayout/fixedLayout/TopBar";
import AdminDashboardMainLayout from "../../components/layout/adminLayout/mainLayouts/AdminDashboardMainLayout";

function AdminDashboard() {
    return (
        <>
            <TopBar
                title="DASHBOARD"
                bg="white"
                iconbg="bg-[#F9F9F9]"
                margin="2"
                showActions={true}
            />
            <div className="w-full ">
                <AdminDashboardMainLayout />
            </div>
        </>
    )
}

export default AdminDashboard;