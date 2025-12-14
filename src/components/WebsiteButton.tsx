import React from "react"
import WebsiteIcon from "react:~assets/website_icon.svg"
import { API_CONF } from "~src/utils/constants";

interface WebsiteButtonProps {
    onClick?: () => Promise<void>
}

export function WebsiteButton({ onClick }: WebsiteButtonProps) {
    const handleClick = async () => {
        if (onClick) {
            await onClick()
        }

        window.open(API_CONF.WEBSITE_URL, "_blank")
    }

    return (
        <button
            className="website-button"
            onClick={handleClick}
            title="Link to our website"
        >
            <WebsiteIcon width={24} height={24} />
        </button>
    )
}
