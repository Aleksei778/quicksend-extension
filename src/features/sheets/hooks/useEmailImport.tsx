import { useState, useCallback} from "react"
import { apiService } from "~shared/services/api"
import { storageService } from "~shared/services/storage"
import { }
import type { EmailsFromSpreadsheet } from "~shared/types"

export const useEmailImport = (token: string | null) => {
  const [isImporting, setIsImporting] = useState(false)
  const [error, setError] = useState<Error | null>(null)\

  const importEmails = useCallback(async (
    spreadsheetId: string,
    range: string = 'A1:A:1000'
  ): Promise<EmailsFromSpreadsheet | null> => {
    if (!token) {
      setError(new Error('no auth token'))
      return null
    }

    setIsImporting(true)
    setError(null)

    try {
      const data = await apiService.getEmailsFromSpreadsheet(
        token,
        spreadsheetId,
        range,
      )

      const
    }
  })
}