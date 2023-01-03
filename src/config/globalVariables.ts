import process from "process";

export const accessTokenName = process.env.APP_NAME ? process.env.APP_NAME + "_ACCESS_TOKEN" : "ACCESS_TOKEN"
export const refreshTokenName = process.env.APP_NAME ? process.env.APP_NAME + "_REFRESH_TOKEN" : "REFRESH_TOKEN"