import { useState, useCallback } from "react"
import { apiService } from "~shared/services/api"
import type { GoogleFile } from "~shared/types"

export const useSpreadsheets = (token: string | null) => {
  const [files, setFiles] = useState<GoogleFile[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  const loadSpreadsheets = useCallback(async () => {
    if (!token) {
      setError(new Error("No auth token"))
      return
    }

    setLoading(true)
    setError(null)

    try {
      const googleToken = await apiService.getGoogleToken(token)

      const response = await fetch(
        'https://www.googleapis.com/auth/spreadsheets.readonly',
      ) {

      }
    }
  })
}