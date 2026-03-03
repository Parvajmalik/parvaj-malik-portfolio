// admin/layout.js — Shared admin sidebar + topbar layout

import { auth } from '../auth.js';
import { api } from '../api.js';

/**
 * Renders the full admin shell (sidebar + topbar).
 * Page JS should then populate document.getElementById('admin-main').
 *
 * @param {string} pageTitle   — shown in topbar
 * @param {string} activePage  — 'dashboard' | 'blogs' | 'projects'
 * @returns {boolean}          — false if redirect happened (not authenticated)
 */
export function initAdminLayout(pageTitle, activePage) {
  if (!auth.requireAuth('../login.html')) return false;

  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: 'bi-speedometer2', href: 'index.html' },
    { key: 'blogs',     label: 'Blogs',     icon: 'bi-journal-text', href: 'blogs.html' },
    { key: 'projects',  label: 'Projects',  icon: 'bi-briefcase',    href: 'projects.html' },
  ];

  document.body.innerHTML = `
    <div class="admin-wrap">

      <!-- ── Sidebar ── -->
      <aside class="admin-sidebar">
        <div class="admin-sidebar-brand">
          <div class="admin-sidebar-logo">PM</div>
          <span>Admin</span>
        </div>

        <nav class="admin-sidebar-nav">
          ${navItems.map(n => `
            <a href="${n.href}" class="admin-nav-link ${activePage === n.key ? 'active' : ''}">
              <i class="bi ${n.icon}"></i>
              <span>${n.label}</span>
            </a>
          `).join('')}
        </nav>

        <a href="../index.html" class="admin-nav-link" style="border-top:1px solid rgba(255,255,255,.1);margin-top:auto">
          <i class="bi bi-house"></i>
          <span>View Site</span>
        </a>

        <button class="admin-logout" id="logoutBtn">
          <i class="bi bi-box-arrow-left"></i>
          <span>Logout</span>
        </button>
      </aside>

      <!-- ── Main area ── -->
      <div class="admin-body">
        <header class="admin-topbar">
          <h5 class="mb-0 fw-semibold">${pageTitle}</h5>
          <span class="admin-user-badge" id="admin-user-badge">
            <i class="bi bi-person-circle"></i>
            <span id="admin-user-name">Loading…</span>
          </span>
        </header>
        <main class="admin-main" id="admin-main">
          <div class="text-center py-5">
            <div class="spinner-border text-orange" role="status"></div>
          </div>
        </main>
      </div>

    </div>
  `;

  // Logout
  document.getElementById('logoutBtn').addEventListener('click', async () => {
    await api.logout().catch(() => {});
    auth.removeToken();
    window.location.href = '../login.html';
  });

  // Load current user name
  api.me()
    .then(u => {
      document.getElementById('admin-user-name').textContent = u.name || u.email;
    })
    .catch(() => {
      auth.removeToken();
      window.location.href = '../login.html';
    });

  return true;
}
