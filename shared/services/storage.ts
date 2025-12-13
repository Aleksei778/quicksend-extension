import { SecureStorage } from "@plasmohq/storage/secure";
import type { TokenData, ImportEmailsSession } from "~shared/types";

class SecureStorageService {
    private storage = new SecureStorage();

    async getTokenData(): Promise<TokenData | null> {
        return this.storage.get('tokenData');
    }

    async setTokenData(tokenData: TokenData): Promise<void> {
        return this.storage.set('tokenData', tokenData);
    }

    async setImportEmailsSession(importEmailsSession: ImportEmailsSession): Promise<void> {
        return this.storage.set('importEmailsSession', importEmailsSession);
    }

    async getImportEmailsSession(id: string): Promise<ImportEmailsSession | null> {
        const sessions = await this.getImportEmailsSessions()

        return sessions['id'] || null
    }

    private async getImportEmailsSessions(): Promise<ImportEmailsSession[]> {
        return (await this.storage.get('importEmailsSessions') as ImportEmailsSession[])
    }

    async setTimezone(timezone: string): Promise<void> {
        return (await this.storage.set('timezone', timezone));
    }

    async getTimezone(timezone: string): Promise<string | null> {
        return (await this.storage.get('timezone') as string)
    }
}

export const storageService = new SecureStorageService();
