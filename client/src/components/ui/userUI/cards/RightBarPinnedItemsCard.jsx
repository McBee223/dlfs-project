function PinnedItemsCard({ pinnedCount }) {
    return (
        <div className="bg-white w-60 2xl:w-70 rounded-2xl cursor-pointer hover:opacity-90 transition pt-4 pb-6 flex items-center my-2">
            <div className="flex flex-col justify-center w-full px-4 gap-0">
                <div className="flex justify-between items-center">
                    <p className="monsterrat text-2xl 2xl:text-3xl text-[#323232] font-semibold">Pinned Items</p>
                </div>
                <p className="monsterrat text-4xl 2xl:text-5xl font-semibold text-[#047EAF] mt-2">
                    {pinnedCount ?? 0}
                </p>
            </div>
        </div>
    );
}

export default PinnedItemsCard;


