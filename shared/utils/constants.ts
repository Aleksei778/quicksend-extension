export const API_CONF = {
    BASE_URL: process.env.BASE_URL || 'http://127.0.0.1:8080',
    ENDPOINTS: {
        REFRESH_TOKEN: '/api/v1/jwt/token/refresh',
        GET_GOOGLE_TOKEN: '/api/v1/google/token',
        GET_EMAILS_FROM_SPREADSHEET: '/api/v1/googlesheets/parse',
        LOGIN: '/api/v1/login',
        PROFILE: 'profile',
        START_CAMPAIGN: '/api/v1/start-campaign'
    },
    TIMEOUT: 1000,
} as const

export const GMAIL_SELECTORS = {
    COMPOSE_BUTTON: '.T-I.T-I-KE.L3',
    COMPOSE_WINDOW: '.AD',
    RECIPIENT_FIELD: '.agP.aFw',
    TOOLBAR: '.gU.Up'
} as const
