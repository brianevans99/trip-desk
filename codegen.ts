import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'apps/api/schema.graphql',
  documents: ['apps/web/src/**/*.{ts,tsx}', '!apps/web/src/gql/**/*'],
  ignoreNoDocuments: true,
  generates: {
    'apps/web/src/gql/': {
      preset: 'client',
      config: { useTypeImports: true },
    },
  },
};

export default config;
