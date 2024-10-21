import type { CodegenConfig } from '@graphql-codegen/cli';
import { environment } from './src/environments/environment';

const config: CodegenConfig = {
  overwrite: true,
  emitLegacyCommonJSImports: false,
  generates: {
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
          Time: 'string',
        },
      },
    },
  },
  hooks: { afterAllFileWrite: ['prettier --write'] },
};

export default config;
