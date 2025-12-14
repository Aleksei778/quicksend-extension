import React from "react";
import { useState } from "react";

import GmailIcon from "react:~assets/gmail.svg";
import SheetsIcon from "react:~assets/googlesheets.svg";

interface SheetsModalWindowProps {
    onSubmit: (spreadsheetId: string, range: string) => void;
    onClose?: () => void;
}

export const SheetsModalWindow = ({
    onSubmit,
    onClose
}: SheetsModalWindowProps) => {
    const [spreadsheetId, setSpreadsheetId] = useState("");
    const [range, setRange] = useState("A2:A10");
    const [sheetName, setSheetName] = useState("Sheet1");

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fullRange = `'${sheetName}'!${range}`
        onSubmit(spreadsheetId.trim(), fullRange);
    }

    return (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="modal-container">
                <div className="modal-logo-container">
                    <GmailIcon className="modal-logo" width={26} height={26} />
                    <SheetsIcon className="modal-logo" width={26} height={26} />
                </div>

                <h3 className="modal-title">
                    Enter Google Sheets Details
                </h3>

                <form onSubmit={handleSubmit} className="modal-form">
                    <input
                        type="text"
                        placeholder="Enter Spreadsheet ID"
                        value={sheetName}
                        onChange={(e) => setSpreadsheetId(e.target.value)}
                        required
                        className="modal-input"
                    />

                    <div className="modal-input-row">
                        <input
                            type="text"
                            placeholder="Sheet name (e.g., Sheet1)"
                            value={sheetName}
                            onChange={(e) => setSheetName(e.target.value)}
                            required
                            className="modal-input flex-1"
                        />

                        <input
                            type="text"
                            placeholder="Range (e.g., A2:A10)"
                            value={range}
                            onChange={(e) => setRange(e.target.value)}
                            required
                            className="modal-input flex-1"
                        />
                    </div>

                    <button type="submit" className="modal-button">
                        Submit
                    </button>

                    <p className="modal-help-text">
                        ** A spreadsheet ID can be extracted from its URL. For example, the
                        spreadsheet ID in the URL
                        https://docs.google.com/spreadsheets/d/abc1234567/edit#gid=0 is
                        'abc1234567'.
                    </p>
                </form>
            </div>
        </div>
    )
}
