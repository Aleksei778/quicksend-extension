import { useAuth } from "~src/hooks/useAuth"
import ProfileIcon from "react:~assets/profile_icon.svg"
import { API_CONF } from "~src/utils/constants";
import React from "react";

interface ProfileButtonProps {
  onClick?: () => Promise<void>;
}

export function ProfileButton({onClick}: ProfileButtonProps) {
  const { token, loading } = useAuth()

  const handleClick = async () => {
    if (loading) {
      return
    }

    const redirectUrl = token
      ? `${API_CONF.WEBSITE_URL}/${API_CONF.WEBSITE_ENDPOINTS.PROFILE}`
      : `${API_CONF.API_URL}/${API_CONF.API_ENDPOINTS.LOGIN}`

    window.open(redirectUrl, "_blank")
  }

  return (
    <button
      className="profile-button"
      onClick={handleClick}
      disabled={loading}
      title={loading ? "Loading..." : token ? "Go to your profile" : "Login"}
    >
      <ProfileIcon />
    </button>
  )
}
