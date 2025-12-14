import type { PlasmoCSConfig, PlasmoGetInlineAnchorList } from "plasmo";
import React, { useRef } from "react";

import { QuickSendButton } from "~src/components/QuickSendButton"
import { waitForElement } from "~src/utils/helpers";
import { GMAIL_SELECTORS } from "~src/utils/constants";
import { apiService } from "~src/services/api";
import { gmailService } from "~src/services/gmail";
import { storageService } from "~src/services/storage";
import { findParentComposeWindow } from "~src/utils/helpers";

export const config: PlasmoCSConfig = {
    matches: ["https://mail.google.com/*"],
    all_frames: true,
}

export const getInlineAnchorList: PlasmoGetInlineAnchorList = async () => {
    console.log('get inline anchor list')

    await waitForElement(GMAIL_SELECTORS.COMPOSE_WINDOW)

    const anchors: HTMLElement[] = []

    const composeWindows = document.querySelectorAll(GMAIL_SELECTORS.COMPOSE_WINDOW)

    composeWindows.forEach((window) => {
        const sendButton = window.querySelector(GMAIL_SELECTORS.SEND_BUTTON)

        if (sendButton) {
            anchors.push(sendButton.parentElement as HTMLElement)
        }
    })

    console.log(`[QuickSend] Found ${anchors.length} compose windows`)
    return anchors
}

export default function QuickSendInline() {
    const containerRef = useRef<HTMLDivElement>(null);

    const handleClick = async () => {
        if (!containerRef.current) return

        const composeWindow = findParentComposeWindow(containerRef.current);

        if (!composeWindow) {
            console.error("[Qucksend] Compose window not found!")
            return
        }

        const tokenData = await storageService.getTokenData()
        const token = tokenData?.accessToken;

        if (!token) return;

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

    return <QuickSendButton />
}
