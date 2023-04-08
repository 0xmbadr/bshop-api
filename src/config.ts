export const env = process.env.NODE_ENV;
export const port = process.env.PORT;

export const db = {
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
};
export const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRE_TIME = process.env.JWT_EXPIRE_TIME;
