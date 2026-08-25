// Supabase client initialization - shared across auth pages
(function() {
  'use strict';

  const SUPABASE_URL = 'https://utdvcslcnbheqayhhzhg.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_7Q1yciT5LqZT6q_0GJfmpA_q6oU7QgS';

  // Expose the client globally for page scripts
  window.supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: {
      experimental: { passkey: true }
    }
  });

  // Handle OAuth redirect callback
  // Supabase OAuth returns tokens in URL hash (#access_token=...), not in query
  // getSession() auto-parses the hash and restores the session
  const hasOAuthCode =
    new URLSearchParams(window.location.search).has('code') ||
    window.location.hash.includes('access_token=');

  supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session && data.session.user && hasOAuthCode) {
      // Clean up the URL hash (remove tokens from address bar)
      if (window.location.hash) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      // If we're on an auth page, redirect to home
      const path = window.location.pathname;
      const isAuthPage =
        path.includes('/login') || path.includes('/register') || path.includes('/forgot-password');
      if (isAuthPage) {
        const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
        sessionStorage.removeItem('redirectAfterLogin');
        window.location.href = redirectTo;
      }
    }
  });

  // Log auth state changes (handy for debugging)
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN') {
      console.log('[auth] signed in:', session?.user?.email);
    } else if (event === 'SIGNED_OUT') {
      console.log('[auth] signed out');
    }
  });
})();
