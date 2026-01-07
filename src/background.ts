import { API_CONF } from "~src/utils/constants"
import { storageService } from "~src/services/storage"
import type { EmailData, EmailsFromSpreadsheet, SubscriptionData } from "~src/types"

class AuthManager {
    private baseUrl = API_CONF.API_URL
    private apiEndpoints = API_CONF.API_ENDPOINTS
    private storageService = storageService

    async login(interactive: boolean = true): Promise<string> {
        return new Promise((resolve, reject) => {
            const authUrl = `${this.baseUrl}${this.apiEndpoints.LOGIN}?redirect_to=extension&lang=en`

            console.log('[🔵 Quicksend] Starting OAuth flow:', authUrl)

            chrome.identity.launchWebAuthFlow(
                {
                    url: authUrl,
                    interactive: interactive
                },
                async (redirectUrl) => {
                    if (chrome.runtime.lastError) {
                        console.error('[🔵 Quicksend] OAuth error:', chrome.runtime.lastError.message)
                        reject(chrome.runtime.lastError)
                        return
                    }

                    if (!redirectUrl) {
                        reject(new Error('[🔵 Quicksend] No redirect URL'))
                        return
                    }

                    console.log('[🔵 Quicksend] Got redirect URL:', redirectUrl)

                    try {
                        const url = new URL(redirectUrl)
                        const accessToken = url.searchParams.get("access_token")
                        const refreshToken = url.searchParams.get("refresh_token")

                        if (!accessToken || !refreshToken) {
                            console.error('[🔵 Quicksend] No tokens in redirect URL')
                            reject(new Error('[🔵 Quicksend] No JWT tokens'))
                            return
                        }

                        await this.storageService.setAccessToken(accessToken)
                        await this.storageService.setRefreshToken(refreshToken)

                        console.log('[🔵 Quicksend] Quicksend: Logged in successfully')
                        resolve(accessToken)
                    } catch (error) {
                        console.error('[🔵 Quicksend] Error parsing redirect URL:', error)
                        reject(error)
                    }
                }
            )
        })
    }

    private async refreshToken(): Promise<string> {
        const refreshToken = await this.storageService.getRefreshToken()

        if (!refreshToken) {
            throw new Error('[🔵 Quicksend] No refresh token')
        }

        try {
            const response = await fetch(this.baseUrl + this.apiEndpoints.REFRESH_TOKEN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${refreshToken}`,
                }
            })

            if (!response.ok) {
                throw new Error('[🔵 Quicksend] Failed to refresh token')
            }

            const data = await response.json()
            const newAccessToken = data.access_token

            await this.storageService.setAccessToken(newAccessToken)

            console.log('[🔵 Quicksend] Token refreshed')

            return newAccessToken
        } catch (error) {
            console.error('[🔵 Quicksend] Failed to refresh token:', error)
            throw new Error(error.message)
        }
    }

    async apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const accessToken = await this.storageService.getAccessToken()

        if (!accessToken) {
            throw new Error('No access token')
        }

        let response = await fetch(this.baseUrl + endpoint, {
            ...options,
            headers: {
                ...options.headers,
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            }
        })

        if (response.status === 401) {
            console.log('[🔵 Quicksend] Got 401, refreshing token...')

            try {
                const newAccessToken = await this.refreshToken()

                response = await fetch(this.baseUrl + endpoint, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${newAccessToken}`,
                    }
                })
            } catch (refreshTokenError) {
                console.log('⚠️ Refresh failed, need re-login')

                await this.login(true)

                const token = await this.storageService.getAccessToken()

                response = await fetch(this.baseUrl + endpoint, {
                    ...options,
                    headers: {
                        ...options.headers,
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    }
                })
            }
        }

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        return await response.json()
    }

    async getEmailsFromSpreadsheet(
        spreadsheetId: string,
        range: string
    ): Promise<EmailsFromSpreadsheet> {
        return await this.apiRequest<EmailsFromSpreadsheet>(
            API_CONF.API_ENDPOINTS.PARSE_EMAILS_FROM_SPREADSHEET,
            {
                method: 'POST',
                body: JSON.stringify({
                    spreadsheet_id: spreadsheetId,
                    range: range,
                })
            }
        )
    }

    async startCampaign(
        emailData: EmailData,
        files: Array<{ blob: Blob; filename: string }>
    ): Promise<string> {
        const formData = new FormData()

        for (const file of files) {
            formData.append("files", file.blob, file.filename)
        }

        formData.append("body", JSON.stringify(emailData))

        const accessToken = await this.storageService.getAccessToken()

        let response = await fetch(this.baseUrl + API_CONF.API_ENDPOINTS.START_CAMPAIGN, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
            },
            body: formData
        })

        if (response.status === 401) {
            const newToken = await this.refreshToken()

            response = await fetch(this.baseUrl + API_CONF.API_ENDPOINTS.START_CAMPAIGN, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${newToken}`,
                },
                body: formData
            })
        }

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
        }

        return await response.json()
    }

    async fetchAttachment(attachmentUrl: string): Promise<Blob> {
        const response = await fetch(attachmentUrl, {
            credentials: 'include',
        })

        if (!response.ok) {
            throw new Error("Failed to fetch attachment")
        }

        return await response.blob()
    }

    async checkSubscription(): Promise<SubscriptionData> {
        return await this.apiRequest<SubscriptionData>(
            API_CONF.API_ENDPOINTS.CHECK_SUBSCRIPTION,
            { method: 'GET' }
        )
    }
}

const authManager = new AuthManager()

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if (message.type === 'GET_EMAILS') {
        authManager.getEmailsFromSpreadsheet(message.spreadsheetId, message.range)
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }))
        return true
    }

    if (message.type === 'START_CAMPAIGN') {
        authManager.startCampaign(message.emailData, message.files)
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }))
        return true
    }

    if (message.type === 'FETCH_ATTACHMENT') {
        authManager.fetchAttachment(message.attachmentUrl)
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }))
        return true
    }

    if (message.type === 'CHECK_SUBSCRIPTION') {
        authManager.checkSubscription()
            .then(data => sendResponse({ success: true, data }))
            .catch(error => sendResponse({ success: false, error: error.message }))
        return true
    }
})

chrome.webNavigation.onCompleted.addListener(
    async (details) => {
        if (details.frameId !== 0) return

        console.log('📧 Gmail opened')

        const accessToken = await storageService.getAccessToken()
        const refreshToken = await storageService.getRefreshToken()

        if (!accessToken || !refreshToken) {
            console.log('⚠️ No tokens, starting login...')

            try {
                await authManager.login(true)

                chrome.tabs.sendMessage(details.tabId, {
                    type: 'AUTH_SUCCESS',
                }).catch(() => {
                    console.log('Content script not ready yet')
                })
            } catch (error) {
                console.error('[🔵 Quicksend] Login failed:', error.error)
            }
        } else {
            console.log('[🔵 Quicksend] Has tokens')

            chrome.tabs.sendMessage(details.tabId, {
                type: 'ALREADY_AUTHENTICATED'
            }).catch(() => {})
        }
    },
    {
        url: [{ hostContains: 'mail.google.com' }]
    }
)

console.log('[🔵 Quicksend] Background script loaded!')

export {}
