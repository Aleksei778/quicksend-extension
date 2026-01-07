import { SecureStorage } from "@plasmohq/storage/secure";
import type { TokenData, ImportEmailsSession } from "~src/types";

class SecureStorageService {
    private storage = new SecureStorage();

    async setImportEmailsSession(importEmailsSession: ImportEmailsSession): Promise<void> {
        return this.storage.set('importEmailsSession', importEmailsSession);
    }

    async getImportEmailsSessionById(id: string): Promise<ImportEmailsSession | null> {
        const sessions = await this.getImportEmailsSessions()

        return sessions.find(session => session.id === id) || null
    }

    private async getImportEmailsSessions(): Promise<ImportEmailsSession[]> {
        return (await this.storage.get('importEmailsSessions') as ImportEmailsSession[])
    }

    async setAccessToken(accessToken: string): Promise<void> {
        await this.storage.set('access_jwt_token', accessToken);
    }

    async getAccessToken(): Promise<string | null> {
        return (await this.storage.get('access_token') as string)
    }

    async setRefreshToken(refreshToken: string): Promise<void> {
        await this.storage.set('refresh_token', refreshToken);
    }

    async getRefreshToken(): Promise<string | null> {
        return (await this.storage.get('refresh_token') as string)
    }
}

export const storageService = new SecureStorageService();
