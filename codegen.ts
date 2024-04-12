import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'https://timeline-backend.shuttleapp.rs/graphql',
  generates: {
    './src/schema.graphql': {
      plugins: ['schema-ast'],
    },
  },
};

export default config;
