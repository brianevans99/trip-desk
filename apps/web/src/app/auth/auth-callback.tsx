import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApolloClient } from '@apollo/client/react';

export function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false); // React StrictMode runs effects twice; a code works only once
  const client = useApolloClient();

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const verifier = sessionStorage.getItem('pkce_verifier');
    const savedState = sessionStorage.getItem('oauth_state');
    sessionStorage.removeItem('pkce_verifier');
    sessionStorage.removeItem('oauth_state');

    if (!code || !verifier || state !== savedState) {
      setError('Sign-in was interrupted. Please try again.');
      return;
    }

    fetch('/api/auth/github', {
      method: 'POST',
      credentials: 'include', // lets the browser accept the session cookie
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, codeVerifier: verifier }),
    })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then(async () => {
        await client.resetStore(); // drop the cached signed-out data and refetch as you
        navigate('/itineraries', { replace: true });
      })
      .catch(() => setError('GitHub sign-in failed. Please try again.'));
  }, [navigate, client]);

  return <p role="status" className="p-6">{error ?? 'Signing you in…'}</p>;
}
