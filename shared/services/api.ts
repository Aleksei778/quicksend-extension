import { API_CONF } from "~shared/utils/constants"
import { EmailsFromSpreadsheet } from "~shared/types";

class ApiService {
    private baseUrl = API_CONF.BASE_URL

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

    async refreshToken(): Promise<string> {
        const data = await this.request<{ access_token: string }>(
            API_CONF.ENDPOINTS.REFRESH_TOKEN,
            { method: 'POST' }
        )

        return data.access_token
    }

    async getGoogleToken(accessToken: string): Promise<string> {
        const data = await this.request<{ google_token: string }>(
            API_CONF.ENDPOINTS.GET_GOOGLE_TOKEN,
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
            API_CONF.ENDPOINTS.GET_EMAILS_FROM_SPREADSHEET,
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
}

export const apiService = new ApiService()
