import { parseDatabaseUrl, DatabaseConfig } from './database-url-parser';

export default () => {
  // Use individual environment variables for database connection
  const dbConfig: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'postgres',
  };

  return {
    port: parseInt(process.env.PORT || '2000', 10),
    database: dbConfig,
    nodeEnv: process.env.NODE_ENV || 'development',
  };
};
