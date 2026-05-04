import { useState, useEffect } from "react";

function AiChatBubble({ text }) {
    const [displayed, setDisplayed] = useState("");

    useEffect(() => {
        setDisplayed("");
        let i = 0;
        const interval = setInterval(() => {
            i++;
            setDisplayed(text.slice(0, i));
            if (i >= text.length) clearInterval(interval);
        }, 12);
        return () => clearInterval(interval);
    }, [text]);

    return (
        <div className="flex justify-start">
            <div className="bg-[#E8F7FF] text-[#047EAF] text-[12px] font-semibold px-4 py-3 rounded-r-2xl rounded-bl-2xl max-w-[80%] wrap-break-word">
                {displayed}
            </div>
        </div>
    );
}

export default AiChatBubble;