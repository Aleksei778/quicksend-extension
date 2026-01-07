export interface AttachmentData {
    filename: string
    url: string
    filesize: string
}

export interface EmailsFromSpreadsheet {
    spreadsheetId: string
    spreadsheetName: string
    emails: string[]
    totalCount: number
}

export interface TokenData {
    accessToken: string
    expiresAt?: number
    lastRefreshed: number
}

export interface ImportEmailsSession {
    id: string
    sheetName: string
    emails: string[]
    timestamp: number
}

export interface SubscriptionData {
    plan?: string
}

export interface EmailData {
    recipients: string[]
    subject: string
    body: string
    date: string
    time: string
    timezone: string
}

export interface SheetsModalWindowProps {
    onSubmit: (spreadsheetId: string, range: string) => Promise<void>
    onClose?: () => void
}

export interface CampaignDropdownProps {
    isVisible: boolean
}

export interface ProfileButtonProps {
    onClick?: () => Promise<void>
}

export interface QuickSendButtonProps {
    onClick?: () => Promise<void>
}

export interface WebsiteButtonProps {
    onClick?: () => Promise<void>
}
