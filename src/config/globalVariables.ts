import process from "process";

export const accessTokenName = process.env.APP_NAME ? process.env.APP_NAME + "_ACCESS_TOKEN" : "ACCESS_TOKEN"
export const refreshTokenName = process.env.APP_NAME ? process.env.APP_NAME + "_REFRESH_TOKEN" : "REFRESH_TOKEN"

export const accessTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: 'none',
  maxAge:  60 * 60 * 1000 // 1 hour
}

export const refreshTokenCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: 'none',
  maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
}