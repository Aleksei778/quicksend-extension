import React, { useState, useEffect } from "react";
import type { PlasmoCSConfig, PlasmoGetInlineAnchor } from "plasmo";

import { ProfileButton } from "~src/components/ProfileButton";
import { SpreadsheetsButton } from "~src/components/SpreadsheetsButton";
import { WebsiteButton } from "~src/components/WebsiteButton";
import { SheetsModalWindow } from "~src/components/SheetsModalWindow";
import { apiService } from "~src/services/api";
import { gmailService } from "~src/services/gmail";
import { storageService } from "~src/services/storage";

export const config: PlasmoCSConfig = {
    matches: ["https://mail.google.com/*"],
}

export const getInlineAnchor: PlasmoGetInlineAnchor = async () => {
    const MAX_RETRIES = 50
    let retries = 0

    return new Promise<Element>((resolve, reject) => {
        const checkElement = () => {
            const elements = document.getElementsByClassName("zo")

            if (elements.length > 0) {
                resolve(elements[0])
            } else if (retries >= MAX_RETRIES) {
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
    const [showSheets, setShowSheets] = useState(false)

    useEffect(() => {
        const handler = (event: MessageEvent) => {
            console.log("Message received:", event.data) 
            
            if (event.source !== window) return
            if (event.data?.source !== "quicksend") return

            if (event.data.type === "OPEN_SHEETS_MODAL") {
                console.log("Opening sheets modal") 
                setShowSheets(true)
            }
        }

        window.addEventListener("message", handler)
        return () => window.removeEventListener("message", handler)
    }, [])

    const handleSheetsSubmit = async (spreadsheetId: string, range: string) => {
        try {
            const tokenData = await storageService.getTokenData()
            const token = tokenData?.accessToken
            if (!token) {
                console.error("No token found")
                return
            }

            // Находим первое открытое окно compose
            let composeWindows = await gmailService.findComposeWindows()
            
            if (composeWindows.length === 0) {
                console.log("No compose window found, opening new one")
                await gmailService.openComposeWindow()
                await new Promise(resolve => setTimeout(resolve, 500))
                composeWindows = await gmailService.findComposeWindows()
            }

            const composeWindow = composeWindows[0]
            if (!composeWindow) {
                console.error("Could not find or create compose window")
                return
            }

            const data = await apiService.getEmailsFromSpreadsheet(
                token,
                spreadsheetId,
                range
            )

            await gmailService.addEmailChip(
                data.spreadsheetId,
                data.totalCount,
                composeWindow
            )

            setShowSheets(false)
        } catch (error) {
            console.error("Error in handleSheetsSubmit:", error)
        }
    }

    return (
        <>
            <div style={{
                display: 'flex',
                flexDirection: 'row',
                gap: '8px',
                alignItems: 'center'
            }}>
                <ProfileButton />
                <SpreadsheetsButton />
                <WebsiteButton />
            </div>

            {showSheets && (
                <SheetsModalWindow
                    onSubmit={handleSheetsSubmit}
                    onClose={() => setShowSheets(false)}
                />
            )}
        </>
    )
}