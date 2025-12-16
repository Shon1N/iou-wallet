export default interface StravaConfigDTO {
    clientId: string,//'YOUR_STRAVA_CLIENT_ID',
    clientSecret: string,//'YOUR_STRAVA_CLIENT_SECRET', // Keep this secure on your backend!
    redirectUrl: string,//'YOUR_APP_REDIRECT_URL', // e.g., your-app://oauth/strava
    scopes: ['read_all', 'activity:read_all'], // Add the scopes you need
    serviceConfiguration: {
      authorizationEndpoint: 'https://www.strava.com/oauth/authorize',
      tokenEndpoint: 'https://www.strava.com/oauth/token',
      revocationEndpoint: 'https://www.strava.com/oauth/deauthorize', // Optional
    },
}