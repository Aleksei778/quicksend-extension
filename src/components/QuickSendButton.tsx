import React from "react"
import { useState } from "react"
import { Send } from "lucide-react"

interface QuickSendButtonProps {
    onClick?: () => Promise<void>
}

export function QuickSendButton({ onClick }: QuickSendButtonProps) {
    const [disabled, setDisabled] = useState<boolean>(false)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const handleClick = async () => {
        setDisabled(true)
        await onClick()
        setTimeout(() => setDisabled(false), 100)
    }

    return (
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            marginLeft: '12px',
            backgroundColor: disabled ? '#9CA3AF' : (isHovered ? '#0EA5E9' : '#06B6D4'),
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            cursor: disabled ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease-in-out',
            fontWeight: '500',
            fontSize: '14px',
            boxShadow: isHovered && !disabled ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          disabled={disabled}
          title="Click to this Quicksend button instead of Send to send mass emails."
        >
          <Send size={16} strokeWidth={2.5} />
          <span>Quicksend</span>
        </button>
    )
}