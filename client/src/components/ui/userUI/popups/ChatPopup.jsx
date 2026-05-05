    import { useState, useRef, useEffect } from "react";

    import UserChatBubble from "../components/UserChatBubble";
    import AiChatBubble from "../components/AiChatBubble";

    function ChatPopup({ onClose }) {
        const [activeCategory, setActiveCategory] = useState(null);
        const [messages, setMessages] = useState([]);

        const chatEndRef = useRef(null);

        const faqData = [
            {
                category: "General Information & Access",
                questions: [
                    {
                        q: "What is the Digital Lost and Found System (DLFS)?",
                        a: "The Digital Lost and Found System (DLFS) is an online platform designed for the community to browse and claim lost items that have been surrendered to the school authorities."
                    },
                    {
                        q: "Who is eligible to use this system to claim items?",
                        a: "Access to the system is exclusively limited to the students, faculty, and staff of the STI College Santa Maria community."
                    },
                    {
                        q: "Where can I find the physical office to pick up a claimed item?",
                        a: "Our physical office is located on the 2nd Floor of the STI College Santa Maria campus, situated near the stage area."
                    },
                    {
                        q: "Who should I look for to claim my item?",
                        a: "To finalize your claim, please look for our Building Administrator, Ma'am Edelyn \"Edz\" Cayab Magayanes."
                    },
                    {
                        q: "What are the operating hours for item retrieval?",
                        a: "Standard retrieval hours are between 8:00 AM and 5:00 PM. However, once you successfully process a claim through the DLFS, the administrator will provide a specific appointment time for you to pick up your item."
                    }
                ]
            },
            {
                category: "Searching & Filtering",
                questions: [
                    {
                        q: "How can I check if my lost item has been surrendered to the school?",
                        a: "You can easily check by visiting the system's dashboard. Use the search bar or the filtering function to see if your missing item has already been surrendered to and encoded by the admin."
                    },
                    {
                        q: "Can I filter my search by category (e.g., Electronics, Stationery, Wallets)?",
                        a: "Yes, absolutely! The system is designed to make your search more efficient. You can filter items by category to help you find exactly what you’re looking for more quickly."
                    },
                    {
                        q: "What should I do if I can’t find my item in the digital list?",
                        a: "If you recently lost your item, please check back periodically to allow the admin time to encode new arrivals. However, if an item has been missing for a month or more and does not appear in the system, it may not have been surrendered, or it may have already been disposed of according to school policy."
                    },
                    {
                        q: "How often is the digital inventory updated?",
                        a: "Our digital inventory is updated daily, especially on days when many items are turned in. Please keep in mind that items may not appear instantly, as the administrator encodes them alongside their other scheduled duties."
                    }
                ]
            },
            {
                category: "The Claiming Process",
                questions: [
                    {
                        q: "How do I initiate a claim for an item I see in the system?",
                        a: "To start the process, click the \"Claim Item\" button on the item’s listing and answer the required security questions. Once submitted, please wait for the administrator’s approval before proceeding to the physical office."
                    },
                    {
                        q: "What proof do I need to provide to verify that an item belongs to me?",
                        a: "To verify ownership, you must accurately describe any unique characteristics of the item (e.g., specific marks, stickers, or internal contents). Providing a photo of the item or yourself with the item is also highly recommended to speed up the verification process."
                    },
                    {
                        q: "Can I post an announcement for an item I found?",
                        a: "Currently, the DLFS is designed exclusively for the claiming process of items already surrendered to the administration. The system does not support user-posted announcements at this time."
                    },
                    {
                        q: "Can someone else claim an item on my behalf?",
                        a: "Yes, another person can initiate a claim through their account. However, during the scheduled retrieval, they must provide a written consent letter from you. Alternatively, you may accompany them to the Building Admin office to confirm the claim in person."
                    }
                ]
            },
            {
                category: "Policies & Security",
                questions: [
                    {
                        q: "How long does the school keep lost items before they are disposed of or donated?",
                        a: "Unclaimed items are typically held for at least two weeks. The exact duration may vary depending on the nature of the item. After this period, items may be disposed of or donated in accordance with school policy."
                    },
                    {
                        q: "Is my personal information visible to other students when I make a claim?",
                        a: "No. Your personal information is kept secure and is only accessible to the Building Administrator for record-keeping and verification purposes. Other users cannot see your claim history or personal details."
                    },
                    {
                        q: "What happens if I accidentally claim the wrong item?",
                        a: "If you initiate a claim by mistake, you can simply remove it from your active claims. The item will be moved to your Trash folder. The system will always ask for your confirmation before moving an item to the trash to ensure you intended to cancel the claim."
                    }
                ]
            }
        ];

        const chatIdRef = useRef(null);

        const handleQuestionClick = (q, a) => {
            const requestId = Date.now();
            chatIdRef.current = requestId;

            setMessages(prev => [
                ...prev,
                { type: "user", text: q },
                { type: "typing", id: requestId }
            ]);

            setTimeout(() => {
                setMessages(prev => {
                    const filtered = prev.filter(
                        m => !(m.type === "typing" && m.id === requestId)
                    );
                    return [...filtered, { type: "ai", text: a }];
                });
            }, 700);
        };

        useEffect(() => {
            chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }, [messages]);

        return (
            <div className="fixed bottom-6 right-5 w-190 h-140 2xl:w-230 2xl:h-190 bg-white rounded-2xl rounded-br-none shadow-2xl flex flex-col overflow-hidden z-50 animate-popup montserrat">
                <div className="p-3 px-5 flex justify-between items-center bg-[#F9F9F9]">
                    <span className="font-semibold text-base 2xl:text-xl text-[#047EAF]">
                        Frequently Asked Question Chatbot
                    </span>
                    <button
                        onClick={onClose}
                        className="text-[#047EAF] font-bold text-base 2xl:text-xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="flex flex-1 overflow-hidden">
                    <div className="w-[45%] flex flex-col p-2 2xl:p-3 bg-[#fafafa] rounded-md">
                        <div className="flex-1 overflow-y-none p-3 space-y-2 custom-scrollbar">
                            {faqData.map((cat, i) => (
                                <div key={i}>
                                    <button
                                        onClick={() =>
                                            setActiveCategory(activeCategory === i ? null : i)
                                        }
                                        className={`w-full montserrat font-semibold flex items-center justify-between text-left text-sm 2xl:text-lg p-3 rounded-md transition
                                        ${activeCategory === i
                                                ? "bg-[#AFE5FF] text-[#047EAF]"
                                                : "bg-[#E8F7FF] text-[#047EAF] hover:bg-[#D0EDFB]"
                                            }`}
                                    >
                                        <span>{cat.category}</span>

                                        <svg
                                            className={`w-4 h-4 transition-transform duration-300
                                            ${activeCategory === i ? "rotate-180 text-[#047EAF]" : "rotate-0 text-[#6B7280]"}`}
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    <div className={`transition-all duration-300 overflow-hidden ${activeCategory === i ? "max-h-60 mt-1" : "max-h-0"}`}>
                                        <div className="ml-5 max-h-60 overflow-y-auto custom-scrollbar space-y-2.5 pr-1">
                                            {cat.questions.map((q, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => handleQuestionClick(q.q, q.a)}
                                                    className="w-full montserrat text-left text-[#047EAF] font-semibold text-[12px] 2xl:text-[14px] bg-[#D0EDFB] px-2 py-2 rounded-md hover:bg-[#AFE5FF]"
                                                >
                                                    {q.q}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col bg-white">
                        <div className="flex-1 p-3 overflow-y-auto flex flex-col gap-2">
                            {messages.length === 0 && (
                                <span className="text-xs 2xl:text-base text-gray-400">
                                    Ask a question...
                                </span>
                            )}

                            {messages.map((msg, i) => {
                                if (msg.type === "user") {
                                    return <UserChatBubble key={i} text={msg.text} />;
                                }
                                if (msg.type === "ai") {
                                    return <AiChatBubble key={i} text={msg.text} />;
                                }
                                if (msg.type === "typing") {
                                    return (
                                        <div key={i} className="flex justify-start">
                                            <div className="bg-[#E6EEF3] px-4 py-3 rounded-2xl flex gap-1">
                                                <span className="w-2 h-2 2xl:w-3 2x l:h-3 bg-[#1E7FA8] rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 2xl:w-3 2x l:h-3 bg-[#1E7FA8] rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                                <span className="w-2 h-2 2xl:w-3 2x l:h-3 bg-[#1E7FA8] rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                            </div>
                                        </div>
                                    );
                                }
                            })}

                            <div ref={chatEndRef} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    export default ChatPopup;




