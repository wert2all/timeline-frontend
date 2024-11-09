import type { CodegenConfig } from '@graphql-codegen/cli';
import { environment } from './src/environments/environment';

const operationsConfig = (serviceName: string) => ({
  addExplicitOverride: true,
  omitOperationSuffix: true,
  querySuffix: 'Query',
  mutationSuffix: 'Mutation',
  serviceName: serviceName + 'ApiClient',
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
  namedClient: serviceName == '' ? 'default' : serviceName,
  strictScalars: true,
  scalars: {
    Time: 'string',
  },
});

const previewlyOperations = {
  path: './src/app/api/external/previewly/graphql.ts',
  config: {
    schema: environment.services.previewly.url,
    documents: ['./src/app/api/external/previewly/**/*.graphql'],
    plugins: [
      'typescript',
      'typescript-operations',
      'typescript-apollo-angular',
    ],
    config: operationsConfig('previewly'),
  },
};
const previewlyScheme = {
  path: './src/app/api/external/previewly/schema.graphql',
  config: {
    schema: environment.services.previewly.url,
    documents: ['./src/app/api/external/previewly/**/*.graphql'],
    plugins: ['schema-ast'],
  },
};

const timelineScheme = {
  path: './src/app/api/internal/schema.graphql',
  config: {
    schema: environment.graphql,
    documents: ['./src/app/api/internal/**/*.graphql'],
    plugins: ['schema-ast'],
  },
};

const timelineOperations = {
  path: './src/app/api/internal/graphql.ts',
  config: {
    schema: environment.graphql,
    documents: ['./src/app/api/internal/**/*.graphql'],
    plugins: [
      'typescript',
      'typescript-operations',
      'typescript-apollo-angular',
    ],
    config: operationsConfig(''),
  },
};

const config: CodegenConfig = {
  overwrite: true,
  emitLegacyCommonJSImports: false,
  generates: {
    // [previewlyScheme.path]: previewlyScheme.config,
    // [previewlyOperations.path]: previewlyOperations.config,
    [timelineScheme.path]: timelineScheme.config,
    [timelineOperations.path]: timelineOperations.config,
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
};

export default config;
