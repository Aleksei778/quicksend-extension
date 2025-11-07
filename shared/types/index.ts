export interface GoogleFile {
    name: string;
    url: string;

}

export interface EmailsFromSpreadsheet {
    spreadsheetId: string,
    spreadsheetName: string,
    emails: string[],
    totalCount: number,
}
