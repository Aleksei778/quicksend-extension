import { GMAIL_SELECTORS } from "~src/utils/constants"
import type { AttachmentData, EmailData } from "~src/types";
import { storageService } from "~src/services/storage"

class GmailService {
    async getFilesFromGmailMessageWindow(
        composeWindow: HTMLElement,
    ): Promise<AttachmentData[]> {
        const fullSizeWindowParent = document.querySelector("div.aSs") as HTMLElement

        if (fullSizeWindowParent) {
            const style = getComputedStyle(fullSizeWindowParent!).getPropertyValue("visibility: hidden")

            if (!style) {
                const fullSizeWindow = document.querySelector("div")

                if (fullSizeWindow) {
                    composeWindow = fullSizeWindow as HTMLElement
                }
            }
        }

        const hrefs: AttachmentData[] = []
        const attachmentNodes = composeWindow.getElementsByClassName(GMAIL_SELECTORS.ATTACHMENT_NODES);

        for (const node of attachmentNodes) {
            const attachmentInput = node.querySelector("input[name='attachment']");

            if (attachmentInput) {
                const link = node.querySelector("a") as HTMLAnchorElement;

                if (link && link.querySelectorAll("div").length === 2) {
                    const divs = link.querySelectorAll("div");
                    const filename = divs[0].innerText
                    const filesize = divs[1].innerText

                    hrefs.push({ url: link.href, filename, filesize })
                }
            }
        }

        return hrefs
    }

    async getEmailDataFromGmailMessagesWindow(
        composeWindow: HTMLElement,
    ): Promise<EmailData> {
        let workingWindow = composeWindow

        const fullSizeWindowParent = document.querySelector("div.aSs") as HTMLElement
        if (fullSizeWindowParent) {
            const style = getComputedStyle(fullSizeWindowParent!).getPropertyValue("visibility: hidden")

            if (!style) {
                const fullSizeWindow = document.querySelector("div")

                if (fullSizeWindow) {
                    workingWindow = fullSizeWindow as HTMLElement
                }
            }
        }

        const emailData: EmailData = {
            recipients: [],
            subject: "",
            body: "",
            date: "",
            time: "",
            timezone: ""
        }

        const recipientNodes = workingWindow.getElementsByClassName(GMAIL_SELECTORS.RECIPIENTS_NODES)
        emailData.recipients = Array.from(recipientNodes).map(
            (node) => node.getAttribute("data-hovercard-id") || ""
        )

        for (const [index, rep] of emailData.recipients.entries()) {
            if (
                typeof rep === "string" &&
                rep.includes("recipients") &&
                rep.includes("quicksend")
            ) {
                const uniqueId = rep.split("id_")[1].split("@")[0]
                const data = await storageService.getImportEmailsSessionById(uniqueId)

                if (data?.emails) {
                    emailData.recipients.splice(index, 1)
                    emailData.recipients.push(...data.emails)
                }
            }
        }

        const subjectField = workingWindow.querySelector(
            'input[name="subject"]'
        ) as HTMLInputElement;
        emailData.subject = subjectField ? subjectField.value : ""

        const messageBody = workingWindow.querySelector(
            'div[role="textbox"][contenteditable="true"]'
        ) as HTMLInputElement;
        emailData.body = messageBody ? messageBody.innerHTML : ""

        const date = workingWindow.querySelector(
            "#campaign-date"
        ) as HTMLInputElement;
        const time = workingWindow.querySelector(
            "#campaign-time"
        ) as HTMLInputElement;

        const now = new Date();

        if (date && time) {
            const inputDateTime = new Date(`${date.value}T${time.value}`)

            const timezone = await storageService.getTimezone()
            if (timezone) {
                emailData.timezone = timezone
            }

            if (inputDateTime < now) {
                emailData.date = ""
                emailData.time = ""
            } else {
                emailData.date = date.value
                emailData.time = time.value
            }
        }

        return emailData
    }

    async findComposeWindows(): Promise<HTMLElement[]> {
        const composeWindows = document.querySelectorAll(GMAIL_SELECTORS.COMPOSE_WINDOW);
        return Array.from(composeWindows) as HTMLInputElement[]
    }

    async openComposeWindow(): Promise<void> {
        const composeButton = document.querySelector(GMAIL_SELECTORS.COMPOSE_WINDOW_BUTTON) as HTMLButtonElement;
        if (composeButton) {
            composeButton.click();
        }
    }

    async addEmailChip(
        sheetId: string,
        count: number,
        composeWindow: HTMLElement | Document,
    ): Promise<boolean> {
        const recipientField = composeWindow.querySelector(
            GMAIL_SELECTORS.RECIPIENT_FIELD
        ) as HTMLInputElement;

        if (!recipientField) {
            console.error("Recipient field is missing");
            return false;
        }

        const activeElement = document.activeElement;
        recipientField.focus()

        const emailString = `${count}-recipients-id_${sheetId}@quicksend.com`
        recipientField.value = emailString

        const events = [
            new InputEvent("input", { bubbles: true }),
            new KeyboardEvent("keydown", {
                bubbles: true,
                cancelable: true,
                code: "Enter",
            }),
        ]

        events.forEach(event => {
            recipientField.dispatchEvent(event)
        })

        if (activeElement) {
            ;(activeElement as HTMLInputElement).focus()
        }

        return true;
    }
}

export const gmailService = new GmailService()
