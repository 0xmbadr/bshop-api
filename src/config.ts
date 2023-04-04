export const env = process.env.NODE_ENV;
export const port = process.env.PORT;

export const db = {
  name: process.env.DB_NAME || '',
  host: process.env.DB_HOST || '',
  port: process.env.DB_PORT || '',
};
