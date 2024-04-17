import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8000/graphql',
  generates: {
    './src/app/api/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
