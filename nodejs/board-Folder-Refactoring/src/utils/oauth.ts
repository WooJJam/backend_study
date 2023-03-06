const CLIENT_ID = process.env.REST_API_KEY;
const REDIRECT_URI = process.env.REDIRECT_URI;

export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;