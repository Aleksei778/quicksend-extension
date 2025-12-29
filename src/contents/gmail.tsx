import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo"
import React, { useEffect, useRef, useState } from "react"
import { MoreVertical } from "lucide-react"

import { QuickSendButton } from "~src/components/QuickSendButton"
import { waitForElement } from "~src/utils/helpers"
import { GMAIL_SELECTORS } from "~src/utils/constants"
import { apiService } from "~src/services/api"
import { gmailService } from "~src/services/gmail"
import { storageService } from "~src/services/storage"
import { findParentComposeWindow } from "~src/utils/helpers"

import { CampaignDropdown } from "~src/components/CampaignDropdown"
import { SheetsModalWindow } from "~src/components/SheetsModalWindow"
import { subscribe } from "~src/contents/message-bus"

export const config: PlasmoCSConfig = {
    matches: ["https://mail.google.com/*"],
    all_frames: true,
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => { 
    const anchors: Element[] = []

    const composeWindows = document.querySelectorAll(GMAIL_SELECTORS.COMPOSE_WINDOW)

    composeWindows.forEach((window) => {
        const sendButton = window.querySelector(GMAIL_SELECTORS.SEND_BUTTON)

        if (sendButton) {
            const anchor = sendButton.closest('.gU.Up')
            if (anchor) {
                anchors.push(anchor)
            }
        }
    })
    
    return anchors.map(element => ({
        element,
        insertPosition: "afterend" as const
    }))
}

export default function QuickSendInline() {
    const [showCampaign, setShowCampaign] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const [showSheets, setShowSheets] = useState(false)
    const [isDotsHovered, setIsDotsHovered] = useState(false)

    useEffect(() => {
    subscribe((type) => {
        if (type === "OPEN_SHEETS_MODAL") {
        setShowSheets(true)
        }
    })
    }, [])

    useEffect(() => {
      const handler = (event: MessageEvent) => {
        if (event.source !== window) return
        if (event.data?.source !== "quicksend") return

        if (event.data.type === "OPEN_SHEETS_MODAL") {
          setShowSheets(true)
        }
      }

      window.addEventListener("message", handler)
      return () => window.removeEventListener("message", handler)
    }, [])

    const handleClick = async () => {
        if (!containerRef.current) return

        const composeWindow = findParentComposeWindow(containerRef.current)

        if (!composeWindow) {
            console.error("[Qucksend] Compose window not found!")
            return
        }

        const tokenData = await storageService.getTokenData()
        const token = tokenData?.accessToken

        if (!token) return

        const emailData = await gmailService.getEmailDataFromGmailMessagesWindow(composeWindow)
        const attachments = await gmailService.getFilesFromGmailMessageWindow(composeWindow)

        const files = await Promise.all(
            attachments.map(async (attachment) => ({
                blob: await apiService.fetchAttachment(attachment.url),
                filename: attachment.filename,
            }))
        )

        await apiService.startCampaign(token, emailData, files)
    }

    return (
      <div
        ref={containerRef}
        style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        }}
      >
        <QuickSendButton onClick={handleClick} />

        <button
          style={{
            padding: '8px',
            backgroundColor: isDotsHovered ? '#F3F4F6' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
          onClick={() => setShowCampaign(v => !v)}
          onMouseEnter={() => setIsDotsHovered(true)}
          onMouseLeave={() => setIsDotsHovered(false)}
          title="Schedule campaign"
        >
          <MoreVertical size={20} color="#4B5563" strokeWidth={2} />
        </button>

        <CampaignDropdown isVisible={showCampaign} />
      </div>
    )
}