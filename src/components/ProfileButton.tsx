import { User } from "lucide-react"
import React from "react"

import { API_CONF } from "~src/utils/constants"
import type { ProfileButtonProps } from "~src/types"

export function ProfileButton({onClick}: ProfileButtonProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  const handleClick = async () => {
    window.open(`${API_CONF.WEBSITE_URL}/en/profile`, "_blank")
  }

  return (
    <button
      style={{
        padding: '10px',
        backgroundColor: isHovered ? '#F0FDF4' : 'transparent',
        border: isHovered ? '1px solid #BBF7D0' : '1px solid transparent',
        borderRadius: '8px',
        cursor: 'pointer',
        opacity: 1,
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="My profile"
    >
      <User
        size={20} 
        color={isHovered ? '#16A34A' : '#4B5563'}
        strokeWidth={2}
        style={{ transition: 'color 0.2s ease-in-out' }}
      />
    </button>
  )
}