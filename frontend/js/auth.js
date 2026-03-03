// auth.js — Token management & auth guards

export const auth = {
  getToken:    () => localStorage.getItem('auth_token'),
  setToken:    (t) => localStorage.setItem('auth_token', t),
  removeToken: () => localStorage.removeItem('auth_token'),
  isLoggedIn:  () => !!localStorage.getItem('auth_token'),

  // Redirect to login if not authenticated
  requireAuth(loginPath = '../login.html') {
    if (!this.isLoggedIn()) {
      window.location.replace(loginPath);
      return false;
    }
    return true;
  },

  // Redirect to admin dashboard if already logged in
  redirectIfLoggedIn(adminPath = 'admin/index.html') {
    if (this.isLoggedIn()) window.location.replace(adminPath);
  },
};
