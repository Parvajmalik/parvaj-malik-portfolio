// admin/project-list.js — Project management list

import { initAdminLayout } from './layout.js';
import { api } from '../api.js';

async function render() {
  if (!initAdminLayout('Project Management', 'projects')) return;

  const main = document.getElementById('admin-main');

  try {
    const projects = await api.adminGetProjects();

    main.innerHTML = `
      <div class="d-flex justify-content-between align-items-center mb-4">
        <p class="text-secondary mb-0">${projects.length} project${projects.length !== 1 ? 's' : ''}</p>
        <a href="project-form.html" class="btn btn-orange rounded-pill px-4 fw-semibold">
          <i class="bi bi-plus-lg me-1"></i> New Project
        </a>
      </div>

      <div class="admin-table-card">
        ${projects.length === 0
          ? `<div class="text-center py-5">
               <i class="bi bi-briefcase fs-1 text-secondary opacity-50"></i>
               <p class="text-secondary mt-3">No projects yet.</p>
               <a href="project-form.html" class="btn btn-orange rounded-pill px-4">Add your first project</a>
             </div>`
          : `<div class="table-responsive">
               <table class="table table-hover mb-0 align-middle">
                 <thead class="table-light">
                   <tr>
                     <th>Title</th>
                     <th>Category</th>
                     <th>Tech Stack</th>
                     <th>Status</th>
                     <th style="width:120px">Actions</th>
                   </tr>
                 </thead>
                 <tbody>
                   ${projects.map(p => projectRow(p)).join('')}
                 </tbody>
               </table>
             </div>`}
      </div>
    `;
  } catch (e) {
    main.innerHTML = `<div class="alert alert-danger">${e.message}</div>`;
  }
}

function projectRow(p) {
  const tech = Array.isArray(p.tech_stack)
    ? p.tech_stack.slice(0, 3).map(t => `<span class="badge bg-dark text-white me-1">${t}</span>`).join('')
    : '';
  return `
    <tr id="row-${p.id}">
      <td>
        <div class="fw-medium">${p.title}</div>
        <div class="text-secondary small">/projects/${p.slug}</div>
      </td>
      <td><span class="badge bg-light text-dark">${p.category || '—'}</span></td>
      <td>${tech || '<span class="text-secondary small">—</span>'}</td>
      <td>
        <span class="badge ${p.is_published ? 'bg-success' : 'bg-secondary'}">
          ${p.is_published ? 'Published' : 'Draft'}
        </span>
      </td>
      <td>
        <a href="project-form.html?id=${p.id}" class="btn btn-sm btn-outline-dark rounded-pill me-1">Edit</a>
        <button class="btn btn-sm btn-outline-danger rounded-pill" onclick="deleteProject(${p.id})">Del</button>
      </td>
    </tr>
  `;
}

window.deleteProject = async (id) => {
  if (!confirm('Delete this project? This cannot be undone.')) return;
  try {
    await api.deleteProject(id);
    const row = document.getElementById(`row-${id}`);
    if (row) row.remove();
  } catch (e) {
    alert('Delete failed: ' + e.message);
  }
};

render();
