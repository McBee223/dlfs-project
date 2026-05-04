import ItemsManagementLayout from "../componentLayout/ItemsManagementLayout";

function AdminItemsManagementMainLayout() {



    return (
        <div className="flex-1 w-full">
            <div>
                <div className="w-full">
                    <ItemsManagementLayout />
                </div>
            </div>
        </div>
    )
}

export default AdminItemsManagementMainLayout;