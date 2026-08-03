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

  // Handle OAuth redirect callback: after Google/Apple sign-in, browser
  // returns to this page with ?code=... in the URL. supabase-js auto
  // exchanges it; we land with an active session. Only redirect in that case.
  const hasOAuthCode = new URLSearchParams(window.location.search).has('code');
  supabaseClient.auth.getSession().then(({ data }) => {
    if (data.session && hasOAuthCode) {
      const redirectTo = sessionStorage.getItem('redirectAfterLogin') || '/';
      sessionStorage.removeItem('redirectAfterLogin');
      const path = window.location.pathname;
      const isAuthPage =
        path.includes('/login') || path.includes('/register') || path.includes('/forgot-password');
      if (isAuthPage && data.session.user) {
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
