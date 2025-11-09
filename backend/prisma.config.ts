import { defineConfig, env } from "prisma/config";
console.log("prisma called")
console.log({"value": env("DATABASE_URL")})
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"),
  },
});
