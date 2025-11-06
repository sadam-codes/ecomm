export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export function parseDatabaseUrl(databaseUrl: string): DatabaseConfig {
  // Parse URL like: postgresql://username:password@host:port/database
  const url = new URL(databaseUrl);

  return {
    host: url.hostname,
    port: parseInt(url.port || '5432', 10),
    username: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading slash
  };
}
