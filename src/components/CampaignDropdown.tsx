import React from "react"
import { Calendar, Clock } from "lucide-react"

interface CampaignDropdownProps {
    isVisible: boolean
}

export const CampaignDropdown = ({ isVisible }: CampaignDropdownProps) => {
    if (!isVisible) return null

    return (
        <div 
            style={{
                position: 'absolute',
                bottom: '100%',
                right: '0',
                marginBottom: '8px',
                padding: '20px',
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                zIndex: 999999,
                minWidth: '320px',
                maxWidth: '320px',
                width: '320px',
                animation: 'slideUp 0.2s ease-out',
                boxSizing: 'border-box'
            }}
        >
            <style>
                {`
                    @keyframes slideUp {
                        from {
                            transform: translateY(10px);
                            opacity: 0;
                        }
                        to {
                            transform: translateY(0);
                            opacity: 1;
                        }
                    }
                `}
            </style>
            
            <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                marginBottom: '16px',
                color: '#1F2937',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}>
                <Calendar size={20} color="#2563EB" />
                Campaign Schedule
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                    <label 
                        htmlFor="campaign-date" 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '8px'
                        }}
                    >
                        <Calendar size={16} />
                        Date
                    </label>
                    <input
                        type="date"
                        id="campaign-date"
                        name="campaign-date"
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'all 0.2s',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#2563EB'
                            e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#D1D5DB'
                            e.target.style.boxShadow = 'none'
                        }}
                    />
                </div>

                <div>
                    <label 
                        htmlFor="campaign-time" 
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '14px',
                            fontWeight: '500',
                            color: '#374151',
                            marginBottom: '8px'
                        }}
                    >
                        <Clock size={16} />
                        Time
                    </label>
                    <input
                        type="time"
                        id="campaign-time"
                        name="campaign-time"
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid #D1D5DB',
                            borderRadius: '8px',
                            fontSize: '14px',
                            outline: 'none',
                            transition: 'all 0.2s',
                            boxSizing: 'border-box'
                        }}
                        onFocus={(e) => {
                            e.target.style.borderColor = '#2563EB'
                            e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)'
                        }}
                        onBlur={(e) => {
                            e.target.style.borderColor = '#D1D5DB'
                            e.target.style.boxShadow = 'none'
                        }}
                    />
                </div>

                <div style={{
                    paddingTop: '16px',
                    borderTop: '1px solid #E5E7EB'
                }}>
                    <p style={{
                        fontSize: '12px',
                        color: '#6B7280',
                        display: 'flex',
                        alignItems: 'start',
                        gap: '8px'
                    }}>
                        <span style={{ color: '#2563EB', fontWeight: 'bold' }}>ℹ️</span>
                        <span>Both date and time must be specified for the campaign to be scheduled</span>
                    </p>
                </div>
            </div>
        </div>
    )
}