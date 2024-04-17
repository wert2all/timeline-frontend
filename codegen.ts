import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'http://localhost:8000/graphql',
  documents: ['./src/app/api/**/*.graphql'],
  emitLegacyCommonJSImports: false,
  generates: {
    './src/app/api/schema.graphql': {
      plugins: ['schema-ast'],
    },
    './src/app/api/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-apollo-angular',
      ],
      config: {
        addExplicitOverride: true,
        omitOperationSuffix: true,
        querySuffix: 'Query',
        mutationSuffix: 'Mutation',
        serviceName: 'ApiClient',
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
          DateTime: 'Date',
        },
      },
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
};

export default config;
