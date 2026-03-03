// admin/dashboard.js — Admin dashboard page

import { initAdminLayout } from './layout.js';
import { api } from '../api.js';

async function render() {
  if (!initAdminLayout('Dashboard', 'dashboard')) return;

  const main = document.getElementById('admin-main');

  try {
    const [blogs, projects] = await Promise.all([
      api.adminGetBlogs(),
      api.adminGetProjects(),
    ]);

    const publishedCount =
      blogs.filter(b => b.is_published).length +
      projects.filter(p => p.is_published).length;

    main.innerHTML = `
      <!-- Stats row -->
      <div class="row g-4 mb-4">
        <div class="col-md-4">
          <div class="admin-stat-card">
            <div class="admin-stat-icon bg-orange-soft">
              <i class="bi bi-journal-text text-orange fs-4"></i>
            </div>
            <div>
              <div class="admin-stat-num">${blogs.length}</div>
              <div class="admin-stat-label">Total Blogs</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="admin-stat-card">
            <div class="admin-stat-icon bg-orange-soft">
              <i class="bi bi-briefcase text-orange fs-4"></i>
            </div>
            <div>
              <div class="admin-stat-num">${projects.length}</div>
              <div class="admin-stat-label">Total Projects</div>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="admin-stat-card">
            <div class="admin-stat-icon bg-orange-soft">
              <i class="bi bi-check-circle text-orange fs-4"></i>
            </div>
            <div>
              <div class="admin-stat-num">${publishedCount}</div>
              <div class="admin-stat-label">Published Items</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick actions -->
      <div class="d-flex gap-3 mb-4">
        <a href="blog-form.html" class="btn btn-orange rounded-pill px-4 fw-semibold">
          <i class="bi bi-plus-lg me-1"></i> New Blog
        </a>
        <a href="project-form.html" class="btn btn-orange rounded-pill px-4 fw-semibold">
          <i class="bi bi-plus-lg me-1"></i> New Project
        </a>
      </div>

      <!-- Recent blogs table -->
      <div class="admin-table-card mb-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-semibold mb-0">Recent Blogs</h6>
          <a href="blogs.html" class="text-orange text-decoration-none small">View All →</a>
        </div>
        ${blogs.length === 0
          ? '<p class="text-secondary small mb-0">No blogs yet.</p>'
          : `<div class="table-responsive">
              <table class="table table-hover mb-0 align-middle">
                <thead class="table-light">
                  <tr><th>Title</th><th>Category</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  ${blogs.slice(0, 5).map(b => `
                    <tr>
                      <td class="fw-medium">${b.title}</td>
                      <td><span class="badge bg-light text-dark">${b.category || '—'}</span></td>
                      <td><span class="badge ${b.is_published ? 'bg-success' : 'bg-secondary'}">${b.is_published ? 'Published' : 'Draft'}</span></td>
                      <td><a href="blog-form.html?id=${b.id}" class="text-orange text-decoration-none small">Edit</a></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>`}
      </div>

      <!-- Recent projects table -->
      <div class="admin-table-card">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <h6 class="fw-semibold mb-0">Recent Projects</h6>
          <a href="projects.html" class="text-orange text-decoration-none small">View All →</a>
        </div>
        ${projects.length === 0
          ? '<p class="text-secondary small mb-0">No projects yet.</p>'
          : `<div class="table-responsive">
              <table class="table table-hover mb-0 align-middle">
                <thead class="table-light">
                  <tr><th>Title</th><th>Category</th><th>Status</th><th></th></tr>
                </thead>
                <tbody>
                  ${projects.slice(0, 5).map(p => `
                    <tr>
                      <td class="fw-medium">${p.title}</td>
                      <td><span class="badge bg-light text-dark">${p.category || '—'}</span></td>
                      <td><span class="badge ${p.is_published ? 'bg-success' : 'bg-secondary'}">${p.is_published ? 'Published' : 'Draft'}</span></td>
                      <td><a href="project-form.html?id=${p.id}" class="text-orange text-decoration-none small">Edit</a></td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>`}
      </div>
    `;
  } catch (e) {
    main.innerHTML = `<div class="alert alert-danger">${e.message}</div>`;
  }
}

render();
