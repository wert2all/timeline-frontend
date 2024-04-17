import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8000/graphql',
  generates: {
    './src/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
