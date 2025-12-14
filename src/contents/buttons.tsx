import React from "react";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";

import { ProfileButton } from "~src/components/ProfileButton";
import { SpreadsheetsButton } from "~src/components/SpreadsheetsButton";
import { WebsiteButton } from "~src/components/WebsiteButton";
import {  } from "~src/compo"

export const config: PlasmoCSConfig = {
    matches: ["https://mail.google.com/*"],
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
    const MAX_RETRIES = 50
    let retries = 0

    return new Promise((resolve, reject) => {
        const checkElement = () => {
            const elements = document.getElementsByClassName("zo")

            if (elements.length > 0) {
                resolve(elements[0] as HTMLElement)
            } else if (retries >= MAX_RETRIES) {
                console.error("[QuickSend] Anchor element not found after timeout")
                reject(new Error("Anchor element not found"))
            } else {
                retries++
                setTimeout(checkElement, 100)
            }
        }

        checkElement()
    })
}

export default function GmailButtons() {
    return (
        <div className="flex gap-2 items-center">
            <ProfileButton />
            <SpreadsheetsButton />
            <WebsiteButton />
        </div>
    )
}
