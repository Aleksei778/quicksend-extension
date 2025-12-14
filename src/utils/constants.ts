export const API_CONF = {
    WEBSITE_URL: process.env.WEBSITE_URL,
    WEBSITE_ENDPOINTS: {
        PROFILE: '/profile'
    },
    API_URL: process.env.API_URL,
    API_ENDPOINTS: {
        REFRESH_TOKEN: '/api/v1/jwt/token/refresh',
        GET_GOOGLE_TOKEN: '/api/v1/google/token',
        GET_EMAILS_FROM_SPREADSHEET: '/api/v1/googlesheets/parse',
        LOGIN: '/api/v1/login',
        START_CAMPAIGN: '/api/v1/start-campaign',
        CHECK_SUBSCRIPTION: '/api/v1/check-subscription',
    },
    TIMEOUT: 1000,
} as const

export const GMAIL_SELECTORS = {
    COMPOSE_WINDOW_BUTTON: '.T-I.T-I-KE.L3',
    SEND_BUTTON: '.T-I.J-J5-Ji.aoO.v7.T-I-atl.L3',
    COMPOSE_WINDOW: '.aSt,.AD',
    RECIPIENT_FIELD: '.agP.aFw',
    TOOLBAR: '.gU.Up',
    ATTACHMENT_NODES: 'dL',
    RECIPIENTS_NODES: '.afV',
} as const
