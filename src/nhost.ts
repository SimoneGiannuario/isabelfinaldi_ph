// Nhost has been replaced by Cloudflare! 
// This file can be deleted once AdminAuthContext is updated to use a custom auth.
export const nhost = {
  auth: {
    async signIn() { return { session: null, error: new Error('Nhost deprecated') } },
    async signOut() { return { error: null } },
    onAuthStateChanged() { return () => { } }
  },
  getUserSession() {
    // Currently, we'll return a stub session so existing auth checks pass.
    // Replace with actual session logic later.
    return { accessToken: localStorage.getItem('admin_token') };
  }
};
