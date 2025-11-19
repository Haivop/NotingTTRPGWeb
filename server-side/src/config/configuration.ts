export default () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),
  database: {
    host: process.env.POSTGRES_HOST ?? 'localhost',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: process.env.POSTGRES_USER ?? 'noting',
    password: process.env.POSTGRES_PASSWORD ?? 'noting',
    name: process.env.POSTGRES_DB ?? 'noting',
    sync: (process.env.TYPEORM_SYNC ?? 'true').toLowerCase() !== 'false',
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET ?? 'dev_access_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET ?? 'dev_refresh_secret',
    accessTtl: process.env.JWT_ACCESS_TTL ?? '900s',
    refreshTtl: process.env.JWT_REFRESH_TTL ?? '7d',
  },
});
