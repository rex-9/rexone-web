import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
    env: {
      VITE_REACT_APP_NAME: "RexOne",
      VITE_REACT_APP_SERVER_BASE_URL: "http://localhost:3000",
      VITE_REACT_APP_CLIENT_BASE_URL: "http://localhost:5173",
      VITE_REACT_APP_ENV: "test",
    },
  },
});
