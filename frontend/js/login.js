// login.js — Admin login page

import { api } from './api.js';
import { auth } from './auth.js';

// Already logged in → go to admin
auth.redirectIfLoggedIn('admin/index.html');

document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const email    = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const btn      = document.getElementById('login-btn');
  const alert    = document.getElementById('login-error');

  btn.disabled    = true;
  btn.textContent = 'Signing in…';
  alert.classList.add('d-none');

  try {
    const res = await api.login(email, password);
    auth.setToken(res.token);
    window.location.href = 'admin/index.html';
  } catch (err) {
    alert.textContent = err.message || 'Invalid email or password.';
    alert.classList.remove('d-none');
    btn.disabled    = false;
    btn.textContent = 'Sign In';
  }
});
