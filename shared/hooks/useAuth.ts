import { useState, useEffect, useCallback } from 'react'
import { storageService } from "~shared/services/storage"

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    loadToken()
  }, [])

  const loadToken = async () => {
    try {
      const tokenData = await storageService.getTokenData()

      setToken(tokenData?.accessToken || null)
    } catch (error) {
      console.error('Failed to load token', error)
    } finally {
      setLoading(false)
    }
  }

  const refreshToken = useCallback(async () => {
    return new Promise<string | null>((resolve) => {
        chrome.runtime.sendMessage({ type: "REFRESH_TOKEN" }, (response) => {
            const newToken = response?.token || null
            setToken(newToken)
            resolve(newToken)
        })
    })
  }, [])

  return { token, setToken, refreshToken }
}