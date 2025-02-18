"use client";

import { MessageCircleMore } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { useEffect, useState } from "react";
import { sendSuggestionEmail } from "@/app/actions";
import { useUser } from "@clerk/nextjs";

const FeedbackPopover = () => {
    const [message, setMessage] = useState("");
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [processed, setProcessed] = useState(false);
    const { user } = useUser();

    const handleSubmit = async () => {
        if (!message) return;

        await sendSuggestionEmail(
            message,
            user?.emailAddresses[0].emailAddress ?? ""
        );
        setProcessed(true);
    };

    useEffect(() => {
        if (processed) {
            setTimeout(() => {
                setProcessed(false);
                setMessage("");
            }, 2000);
        }
    }, [processed]);

    return (
        <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
                <button className='flex items-center gap-2 border-2 border-gray-300 rounded-lg px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-100'>
                    <MessageCircleMore />
                    Feedback
                </button>
            </PopoverTrigger>
            <PopoverContent className='w-[320px] md:w-[400px]' align='end'>
                <div className='flex flex-col gap-4'>
                    {!processed ? (
                        <>
                            <textarea
                                className='w-full rounded-md border-2 border-gray-300 p-3 text-sm text-gray-900 focus:border-slate-6 focus:outline-none focus-visible:ring-slate-7 focus-visible:ring-2 h-[120px]'
                                style={{ resize: "none" }}
                                value={message}
                                placeholder='Ideas for improvements...'
                                onChange={(e) =>
                                    setMessage(e.target.value)
                                }></textarea>
                            <div className='mt-2 flex flex-row justify-between'>
                                <span>
                                    Need help?{" "}
                                    <a
                                        href='mailto:support@shousai.co.uk'
                                        className='text-blue-500 hover:underline'>
                                        Contact us
                                    </a>
                                </span>
                                <button
                                    className='px-3 py-1 background-gradient text-base font-medium rounded-lg text-white'
                                    onClick={() => handleSubmit()}>
                                    Send
                                </button>
                            </div>
                        </>
                    ) : (
                        <span>Thank you for your suggestion!</span>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default FeedbackPopover;
