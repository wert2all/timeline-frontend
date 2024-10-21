import type { CodegenConfig } from '@graphql-codegen/cli';
import { environment } from './src/environments/environment';

const operationsConfig = (serviceName: string) => ({
  addExplicitOverride: true,
  omitOperationSuffix: true,
  querySuffix: 'Query',
  mutationSuffix: 'Mutation',
  serviceName: serviceName,
  sdkClass: true,
  skipTypename: true,

  skipTypeNameForRoot: true,
  preResolveTypes: true,
  declarationKind: 'interface',
  onlyOperationTypes: true,
  inlineFragmentTypes: 'combine',

  namingConvention: {
    enumValues: 'keep',
  },
  strictScalars: true,
  scalars: {
    Time: 'string',
  },
});

const config: CodegenConfig = {
  overwrite: true,
  emitLegacyCommonJSImports: false,
  generates: {
    './src/app/api/external/previewly/schema.graphql': {
      schema: 'https://api.previewly.top/graphql',
      documents: ['./src/app/api/external/previewly/**/*.graphql'],
      plugins: ['schema-ast'],
    },

    './src/app/api/external/previewly/graphql.ts': {
      schema: 'https://api.previewly.top/graphql',
      documents: ['./src/app/api/external/previewly/**/*.graphql'],
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
      config: operationsConfig('PreviewlyApiClient'),
    },
    './src/app/api/internal/schema.graphql': {
      schema: environment.graphql,
      documents: ['./src/app/api/internal/**/*.graphql'],
      plugins: ['schema-ast'],
    },
    './src/app/api/internal/graphql.ts': {
      schema: environment.graphql,
      documents: ['./src/app/api/internal/**/*.graphql'],
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
      config: operationsConfig('ApiClient'),
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
};

export default config;
