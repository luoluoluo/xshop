import { CodegenConfig } from "@graphql-codegen/cli";
import dotenv from "dotenv";
dotenv.config();

const config: CodegenConfig = {
  debug: true,
  overwrite: true,
  schema: process?.env?.VITE_API_URL || "http://localhost:4003/crm",
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
  },
};

export default config;
