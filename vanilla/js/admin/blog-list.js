// admin/blog-list.js — Blog management list

import { initAdminLayout } from './layout.js';
import { api } from '../api.js';

async function render() {
  if (!initAdminLayout('Blog Management', 'blogs')) return;

  const main = document.getElementById('admin-main');

  try {
    const blogs = await api.adminGetBlogs();

    main.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <p class="text-secondary mb-0">${blogs.length} blog post${blogs.length !== 1 ? 's' : ''}</p>
        <a href="blog-form.html" class="btn btn-orange rounded-pill px-4 fw-semibold">
          <i class="bi bi-plus-lg me-1"></i> New Blog
        </a>
      </div>

      <div class="admin-table-card">
        ${blogs.length === 0
          ? `<div class="text-center py-5">
               <i class="bi bi-journal-text fs-1 text-secondary opacity-50"></i>
               <p class="text-secondary mt-3">No blog posts yet.</p>
               <a href="blog-form.html" class="btn btn-orange rounded-pill px-4">Create your first blog</a>
             </div>`
          : `<div class="table-responsive">
               <table class="table table-hover mb-0 align-middle">
                 <thead class="table-light">
                   <tr>
                     <th>Title</th>
                     <th>Category</th>
                     <th>Author</th>
                     <th>Status</th>
                     <th style="width:120px">Actions</th>
                   </tr>
                 </thead>
                 <tbody id="blog-table-body">
                   ${blogs.map(b => blogRow(b)).join('')}
                 </tbody>
               </table>
             </div>`}
      </div>

      <div id="list-msg" class="mt-3 d-none"></div>
    `;
  } catch (e) {
    main.innerHTML = `<div class="alert alert-danger">${e.message}</div>`;
  }
}

function blogRow(b) {
  return `
    <tr id="row-${b.id}">
      <td>
        <div class="fw-medium">${b.title}</div>
        <div class="text-secondary small">/blogs/${b.slug}</div>
      </td>
      <td><span class="badge bg-light text-dark">${b.category || '—'}</span></td>
      <td class="text-secondary">${b.author || '—'}</td>
      <td>
        <span class="badge ${b.is_published ? 'bg-success' : 'bg-secondary'}">
          ${b.is_published ? 'Published' : 'Draft'}
        </span>
      </td>
      <td>
        <a href="blog-form.html?id=${b.id}" class="btn btn-sm btn-outline-dark rounded-pill me-1">Edit</a>
        <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteBlog(${b.id})">Del</button>
      </td>
    </tr>
  `;
}

window.deleteBlog = async (id) => {
  if (!confirm('Delete this blog post? This cannot be undone.')) return;
  try {
    await api.deleteBlog(id);
    const row = document.getElementById(`row-${id}`);
    if (row) row.remove();
  } catch (e) {
    alert('Delete failed: ' + e.message);
  }
};

render();
