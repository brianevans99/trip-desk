import { useQuery } from '@apollo/client/react';
import { graphql } from '../../gql';
import { startGitHubSignIn } from './pkce';

const ME = graphql(`
  query Me { me { id login avatarUrl } }
`);

export function UserMenu() {
  const { data, loading, client } = useQuery(ME);
  if (loading) return null;

  if (!data?.me) {
    return <button onClick={startGitHubSignIn}>Sign in with GitHub</button>;
  }

  async function signOut() {
    await fetch('http://localhost:3000/api/auth/logout', { method: 'POST', credentials: 'include' });
    await client.resetStore(); // clears cached data and refetches as signed out
  }

  return (
    <div className="flex items-center gap-2">
      {data.me.avatarUrl && <img src={data.me.avatarUrl} alt="" className="h-8 w-8 rounded-full" />}
      <span>Signed in as {data.me.login}</span>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
