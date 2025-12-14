import React from "react";
import { useState } from "react";

interface QuickSendButtonProps {
    onClick?: () => Promise<void>;
}

export function QuickSendButton({ onClick }: QuickSendButtonProps) {
    const [disabled, setDisabled] = useState<boolean>(false);

    const handleClick = async () => {
        setDisabled(true);
        await onClick();
        setTimeout(() => setDisabled(false), 100);
    }

    return (
        <button
          className="ml-2 bg-blue-600 text-whire px-4 py-2 rounded disabled:bg-grey-400 relative"
          onClick={handleClick}
          disabled={disabled}
          title={"Click to this Quicksend button instead of Send to send mass emails."}
        >
          Quicksend
        </button>
    )
}