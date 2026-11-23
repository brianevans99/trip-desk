function base64Url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function randomString() {
  return base64Url(crypto.getRandomValues(new Uint8Array(32)));
}

export async function challengeFrom(verifier: string) {
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier));
  return base64Url(new Uint8Array(hash));
}

export async function startGitHubSignIn() {
  const verifier = randomString();
  const state = randomString(); // CSRF guard: must come back unchanged
  sessionStorage.setItem('pkce_verifier', verifier);
  sessionStorage.setItem('oauth_state', state);

  const params = new URLSearchParams({
    client_id: import.meta.env.VITE_GITHUB_CLIENT_ID,
    redirect_uri: 'http://localhost:4200/auth/callback',
    scope: 'read:user',
    state,
    code_challenge: await challengeFrom(verifier),
    code_challenge_method: 'S256',
  });
  window.location.href = `https://github.com/login/oauth/authorize?${params}`;
}
