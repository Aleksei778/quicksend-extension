import { API_CONF } from "~src/utils/constants"
import type { EmailsFromSpreadsheet, EmailData, SubscriptionData } from "~src/types";

class ApiService {
    private baseUrl = API_CONF.API_URL

    private async request<T>(endpoint: string, options: RequestInit): Promise<T> {
        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), API_CONF.TIMEOUT)

        try {
            const response = await fetch(`${this.baseUrl}/${endpoint}`, {
                ...options,
                signal: controller.signal,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers,
                },
            })

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }

            return await response.json()

        } catch (error) {
            console.error(error);
        } finally {
          clearTimeout(timeout)
        }
    }

    async refreshJwtToken(): Promise<string> {
        const data = await this.request<{ access_token: string }>(
            API_CONF.API_ENDPOINTS.REFRESH_TOKEN,
            { method: 'POST' }
        )

        return data.access_token
    }

    async getGoogleToken(accessToken: string): Promise<string> {
        const data = await this.request<{ google_token: string }>(
            API_CONF.API_ENDPOINTS.GET_GOOGLE_TOKEN,
            {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            }
        )

        return data.google_token
    }

    async getEmailsFromSpreadsheet(
        accessToken: string,
        spreadsheetId: string,
        range: string
    ): Promise<EmailsFromSpreadsheet> {
        const data = this.request<EmailsFromSpreadsheet>(
            API_CONF.API_ENDPOINTS.GET_EMAILS_FROM_SPREADSHEET,
            {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` },
                body: JSON.stringify({
                    spreadsheet_id: spreadsheetId,
                    range: range,
                })
            }
        )

        return data
    }

    async startCampaign(
        token: string,
        emailData: EmailData,
        files: Array<{ blob: Blob; filename: string }>
    ): Promise<string> {
        const formData = new FormData()

        for (const file of files) {
            formData.append("files", file.blob, file.filename)
        }

        formData.append("body", JSON.stringify(formData))

        const data = await this.request<{ message: string }>(
            API_CONF.API_ENDPOINTS.START_CAMPAIGN,
            {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            }
        )

        return data.message
    }

    async fetchAttachment(
        gmailUrl: string,
    ): Promise<Blob> {
        const response = await fetch(`${gmailUrl}`, {
            credentials: 'include',
        })

        if (!response.ok) {
            throw new Error("Failed to fetch attachment")
        }

        return await response.blob()
    }

    async checkSubscription(token: string): Promise<SubscriptionData>
    {
        const data = this.request<SubscriptionData>(
            API_CONF.API_ENDPOINTS.CHECK_SUBSCRIPTION,
            {
                method: 'GET',
                headers: { 'Authorization': `Bearer ${token}` }
            }
        )

        return data
    }
}

export const apiService = new ApiService()
