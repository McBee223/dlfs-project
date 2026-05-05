function UserChatBubble({ text }) {
    return (
        <div className="flex justify-end">
            <div className="montserrat bg-[#047EAF] text-white text-[12px] 2xl:text-[14px] font-semibold px-4 py-2 rounded-br-2xl rounded-l-2xl max-w-[80%] wrap-break-word">
                {text}
            </div>
        </div>
    );
}

export default UserChatBubble;

