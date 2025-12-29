import { useAuth } from "~src/hooks/useAuth"
import { User, LogIn } from "lucide-react"
import { API_CONF } from "~src/utils/constants"
import React from "react"

interface ProfileButtonProps {
  onClick?: () => Promise<void>
}

export function ProfileButton({onClick}: ProfileButtonProps) {
  const { token, loading } = useAuth()
  const [isHovered, setIsHovered] = React.useState(false)

  const handleClick = async () => {
    if (loading) {
      return
    }

    const redirectUrl = token
      ? `${API_CONF.WEBSITE_URL}/${API_CONF.WEBSITE_ENDPOINTS.PROFILE}`
      : `${API_CONF.API_URL}/${API_CONF.API_ENDPOINTS.LOGIN}`

    window.open(redirectUrl, "_blank")
  }

  const Icon = token ? User : LogIn

  return (
    <button
      style={{
        padding: '10px',
        backgroundColor: isHovered ? '#F0FDF4' : 'transparent',
        border: isHovered ? '1px solid #BBF7D0' : '1px solid transparent',
        borderRadius: '8px',
        cursor: loading ? 'not-allowed' : 'pointer',
        opacity: loading ? 0.5 : 1,
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={loading}
      title={loading ? "Loading..." : token ? "My profile" : "Login"}
    >
      <Icon 
        size={20} 
        color={isHovered ? '#16A34A' : '#4B5563'}
        strokeWidth={2}
        style={{ transition: 'color 0.2s ease-in-out' }}
      />
    </button>
  )
}