import React from "react";

interface CampaignDropdownProps {
    isVisible: boolean
}

export const CampaignDropdown = ({ isVisible }: CampaignDropdownProps) => {
    if (!isVisible) return null;

    return (
        <div className="dropdown-window">
            <h3 id="paramsHeader" className="dropdown-window-header">
                Campaign Parameters
            </h3>

            <label htmlFor="campaign-date" className="dropdown-window-date-label">
                Campaign Date
            </label>
            <input
                type="date"
                id="campaign-date"
                name="campaign-date"
                className="dropdown-window-campaign-date-input"
            />

            <label htmlFor="campaign-time" className="dropdown-window-date-label">
                Campaign Date
            </label>
            <input
                type="date"
                id="campaign-date"
                name="campaign-date"
                className="dropdown-window-campaign-date-input"
            />

            <p id="warning-message" className="dropdown-window-p">
                ** Both date and time must be specified for the campaign to be scheduled
            </p>
        </div>
    )
}
