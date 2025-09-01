  import mysql from 'mysql2/promise';

  export async function getConnection() {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'hopper.proxy.rlwy.net',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'SLrmOVZkFjWpLjOBEsekHCLyPvYJCvdm',
      database: process.env.DB_NAME || 'railway',
       port: Number(process.env.DB_PORT) || 13407
    });
    return connection;
  }
