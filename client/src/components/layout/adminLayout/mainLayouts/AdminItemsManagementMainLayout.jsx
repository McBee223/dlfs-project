import { useLocation } from "react-router-dom";
import ItemsManagementLayout from "../componentLayout/ItemsManagementLayout";

function AdminItemsManagementMainLayout() {
    const location = useLocation();
    const searchQuery = location.state?.searchQuery || "";

    return (
        <div className="flex-1 w-full">
            <div>
                <div className="w-full">
                    <ItemsManagementLayout initialSearch={searchQuery} />
                </div>
            </div>
        </div>
    );
}

export default AdminItemsManagementMainLayout;


