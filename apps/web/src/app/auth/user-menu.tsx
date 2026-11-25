import { useQuery } from '@apollo/client/react';
import { graphql } from '../../gql';
import { startGitHubSignIn } from './pkce';

const ME = graphql(`
  query Me { me { id login avatarUrl } }
`);

const buttonClass =
  'rounded-lg px-4 py-2 text-sm font-medium focus:ring-4 focus:outline-none cursor-pointer';

export function UserMenu() {
  const { data, loading, client } = useQuery(ME);
  if (loading) return null;

  if (!data?.me) {
    return (
      <button
        type="button"
        onClick={startGitHubSignIn}
        className={`${buttonClass} bg-brand-600 text-white hover:bg-brand-700 focus:ring-ink`}
      >
        Sign in with GitHub
      </button>
    );
  }

  async function signOut() {
    await fetch('http://localhost:3000/api/auth/logout', { method: 'POST', credentials: 'include' });
    await client.resetStore(); // clears cached data and refetches as signed out
  }

  return (
    <div className="flex items-center gap-3">
      {data.me.avatarUrl && (
        <img src={data.me.avatarUrl} alt="" className="h-8 w-8 rounded-full" />
      )}
      <span className="hidden text-sm text-gray-700 sm:inline">{data.me.login}</span>
      <button
        type="button"
        onClick={signOut}
        className={`${buttonClass} border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-200`}
      >
        Sign out
      </button>
    </div>
  );
}
