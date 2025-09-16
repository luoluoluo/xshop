import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  debug: true,
  overwrite: true,
  schema: "http://localhost:4001/store",
  // this assumes that all your source files are in a top-level `src/` directory - you might need to adjust this to your file structure
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-operations"],
    },
  },
};

export default config;
