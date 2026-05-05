import TopBar from "../../components/layout/userLayout/fixedLayout/TopBar";
import ItemMainLayout from "../../components/layout/userLayout/mainLayouts/ItemsMainLayout";

function Items() {
    return (
        <div className="bg-white h-screen">
            <TopBar
                title="My Lost And Found Items"
                bg="white"
                iconbg="bg-[#F9F9F9]"
            />

            <div className="flex flex-1 bg-white">
                <ItemMainLayout />
            </div>
        </div>
    )
}

export default Items;


