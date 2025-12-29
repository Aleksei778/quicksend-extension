import { useAuth } from "~src/hooks/useAuth"
import { Sheet } from "lucide-react"
import React from "react"
import { apiService } from "~src/services/api"

export function SpreadsheetsButton() {
  const { token, loading } = useAuth()
  const [hasAccess, setHasAccess] = React.useState(true)
  const [isHovered, setIsHovered] = React.useState(false)

  React.useEffect(() => {
    const checkAccess = async () => {
      if (!token) return

      try {
        const subscriptionData = await apiService.checkSubscription(token)

        const hasValidPlan =
            subscriptionData.plan !== undefined &&
            subscriptionData.plan !== "free_trial"

        setHasAccess(hasValidPlan)
      } catch (error) {
        console.error("Failed to check subscription", error)
      }
    }

    checkAccess()
  }, [token])

  if (!hasAccess || loading) {
    return null
  }

  const handleClick = () => {
    window.postMessage(
      {
        source: "quicksend",
        type: "OPEN_SHEETS_MODAL"
      },
      "*"
    )
  }

  return (
    <button
      style={{
        padding: '10px',
        backgroundColor: isHovered ? '#EFF6FF' : 'transparent',
        border: isHovered ? '1px solid #BFDBFE' : '1px solid transparent',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      title="Parse recipients from Google Sheets"
    >
      <Sheet 
        size={20} 
        color={isHovered ? '#2563EB' : '#4B5563'}
        strokeWidth={2}
        style={{ transition: 'color 0.2s ease-in-out' }}
      />
    </button>
  )
}