import { CombinedGraphQLErrors } from '@apollo/client';

export function isUnauthenticated(error: unknown): boolean {
  return (
    CombinedGraphQLErrors.is(error) &&
    error.errors.some((e) => e.extensions?.['code'] === 'UNAUTHENTICATED')
  );
}
