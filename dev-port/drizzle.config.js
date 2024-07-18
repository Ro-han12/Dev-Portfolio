/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.jsx",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:Xf5hBa7iwxsR@ep-damp-wind-a56mq52c.us-east-2.aws.neon.tech/dev-neondb?sslmode=require'
    }
  };