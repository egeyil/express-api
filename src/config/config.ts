const env = process.env.NODE_ENV || 'development';

if (env !== 'production' && env !== 'development' && env !== 'test') {
  throw new Error('NODE_ENV must be either production, development or test');
}

const development = {
  port: "3500",
  accessTokenName: process.env.APP_NAME ? process.env.APP_NAME + "_ACCESS_TOKEN" : "ACCESS_TOKEN",
  refreshTokenName: process.env.APP_NAME ? process.env.APP_NAME + "_REFRESH_TOKEN" : "REFRESH_TOKEN",
  accessTokenSecret: process.env.DEVELOPMENT_ACCESS_TOKEN_SECRET as string,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15s",
  refreshTokenSecret: process.env.DEVELOPMENT_REFRESH_TOKEN_SECRET as string,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  databaseUrl: process.env.DEVELOPMENT_DATABASE_URL,
  allowedOrigins: [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500',
    'http://localhost:3000'
  ],
};

//@ts-ignore
const test = {
  port: "3456",
  accessTokenName: process.env.APP_NAME ? process.env.APP_NAME + "_ACCESS_TOKEN" : "ACCESS_TOKEN",
  refreshTokenName: process.env.APP_NAME ? process.env.APP_NAME + "_REFRESH_TOKEN" : "REFRESH_TOKEN",
  accessTokenSecret: process.env.TEST_ACCESS_TOKEN_SECRET as string,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15s",
  refreshTokenSecret: process.env.TEST_REFRESH_TOKEN_SECRET as string,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  databaseUrl: process.env.TEST_DATABASE_URL,
  allowedOrigins: [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500',
    'http://localhost:3000'
  ],
}

const production = {
  port: process.env.PRODUCTION_PORT || "3000",
  accessTokenName: process.env.APP_NAME ? process.env.APP_NAME + "_ACCESS_TOKEN" : "ACCESS_TOKEN",
  refreshTokenName: process.env.APP_NAME ? process.env.APP_NAME + "_REFRESH_TOKEN" : "REFRESH_TOKEN",
  accessTokenSecret: process.env.PRODUCTION_ACCESS_TOKEN_SECRET as string,
  accessTokenExpiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15s",
  refreshTokenSecret: process.env.PRODUCTION_REFRESH_TOKEN_SECRET as string,
  refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "30d",
  databaseUrl: process.env.PRODUCTION_DATABASE_URL,
  allowedOrigins: process.env.ALLOWED_ORIGIN || [
    'https://www.yoursite.com',
    'http://127.0.0.1:5500',
    'http://localhost:3500',
    'http://localhost:3000'
  ],
}

const config = {
  development,
  test,
  production
};

if (!config[env] || Object.values(config[env]).some(value => value === undefined)) {
  console.error('No config found for the current environment');
  process.exit(1);
}

export const roles = {
  "Admin": process.env.ROLES_ADMIN || "5150",
  "Editor": process.env.ROLES_USER || "1984",
  "User": process.env.ROLES_USER || "2001"
}

export default config[env];



