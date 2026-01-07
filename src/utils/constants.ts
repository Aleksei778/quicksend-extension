export const API_CONF = {
    WEBSITE_URL: 'https://quicksend.vercel.app',
    API_URL: 'http://localhost',
    API_ENDPOINTS: {
        REFRESH_TOKEN: '/api/auth/jwt/refresh',
        PARSE_EMAILS_FROM_SPREADSHEET: '/api/googlesheet/parse',
        LOGIN: '/api/auth/google/login',
        START_CAMPAIGN: '/api/campaign/start',
        CHECK_SUBSCRIPTION: '/api/subscription/current'
    },
} as const

export const GMAIL_SELECTORS = {
    COMPOSE_WINDOW_BUTTON: '.T-I.T-I-KE.L3',
    SEND_BUTTON: '.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3',
    COMPOSE_WINDOW: '.aSt,.AD',
    RECIPIENT_FIELD: '.agP.aFw',
    ATTACHMENT_NODES: 'dL',
    RECIPIENTS_NODES: '.afV',
} as const

export const TIMEZONES = [
    { value: 'UTC', label: 'UTC (GMT+0)', offset: '+00:00' },
    { value: 'America/New_York', label: 'New York (EST/EDT)', offset: '-05:00' },
    { value: 'America/Los_Angeles', label: 'Los Angeles (PST/PDT)', offset: '-08:00' },
    { value: 'America/Chicago', label: 'Chicago (CST/CDT)', offset: '-06:00' },
    { value: 'America/Denver', label: 'Denver (MST/MDT)', offset: '-07:00' },
    { value: 'Europe/London', label: 'London (GMT/BST)', offset: '+00:00' },
    { value: 'Europe/Paris', label: 'Paris (CET/CEST)', offset: '+01:00' },
    { value: 'Europe/Berlin', label: 'Berlin (CET/CEST)', offset: '+01:00' },
    { value: 'Europe/Moscow', label: 'Moscow (MSK)', offset: '+03:00' },
    { value: 'Asia/Dubai', label: 'Dubai (GST)', offset: '+04:00' },
    { value: 'Asia/Kolkata', label: 'Mumbai (IST)', offset: '+05:30' },
    { value: 'Asia/Shanghai', label: 'Shanghai (CST)', offset: '+08:00' },
    { value: 'Asia/Tokyo', label: 'Tokyo (JST)', offset: '+09:00' },
    { value: 'Asia/Seoul', label: 'Seoul (KST)', offset: '+09:00' },
    { value: 'Australia/Sydney', label: 'Sydney (AEDT/AEST)', offset: '+10:00' },
    { value: 'Pacific/Auckland', label: 'Auckland (NZDT/NZST)', offset: '+12:00' },
] as const
