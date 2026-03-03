// project.js — Projects listing page

import { loadData, renderHeader, renderFooter } from './main.js';
import { api } from './api.js';

function renderProjects(projects) {
  if (!projects.length) {
    return `<div class="col-12 text-center py-5 text-secondary">
              <i class="bi bi-briefcase fs-1 opacity-50 d-block mb-3"></i>
              No projects published yet.
            </div>`;
  }

  return projects.map(p => {
    const tech = Array.isArray(p.tech_stack) && p.tech_stack.length
      ? `<div class="d-flex flex-wrap gap-1 mt-2">
           ${p.tech_stack.map(t => `<span class="badge bg-dark text-white">${t}</span>`).join('')}
         </div>`
      : '';

    return `
      <div class="col-md-6 col-lg-4">
        <div class="card border-0 rounded-4 overflow-hidden h-100 project-card">
          <div class="position-relative overflow-hidden">
            ${p.featured_image
              ? `<img src="${p.featured_image}" alt="${p.title}" class="project-img" />`
              : `<div class="project-img bg-light d-flex align-items-center justify-content-center text-secondary fs-1">
                   <i class="bi bi-image"></i>
                 </div>`}
            <a href="project-detail.html?slug=${p.slug}"
               class="btn rounded-circle d-flex align-items-center justify-content-center position-absolute btn-circle">
              <i class="bi bi-arrow-up-right"></i>
            </a>
          </div>

          <div class="card-body p-3 d-flex flex-column">
            <span class="badge rounded-pill px-3 py-2 mb-2 fw-medium blog-badge">${p.category || 'Project'}</span>
            <h5 class="fw-semibold text-dark-custom mb-1">${p.title}</h5>
            <p class="text-secondary small mb-2 flex-grow-1">${p.excerpt || ''}</p>
            ${tech}
            <div class="d-flex gap-2 mt-3">
              ${p.live_url ? `<a href="${p.live_url}" target="_blank" class="btn btn-sm btn-orange rounded-pill px-3"><i class="bi bi-box-arrow-up-right me-1"></i>Live</a>` : ''}
              ${p.github_url ? `<a href="${p.github_url}" target="_blank" class="btn btn-sm btn-outline-dark rounded-pill px-3"><i class="bi bi-github me-1"></i>Code</a>` : ''}
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

async function init() {
  const [data, projects] = await Promise.all([
    loadData(),
    api.getProjects().catch(() => []),
  ]);

  renderHeader(data);

  document.getElementById('site-main').innerHTML = `
    <div class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <h1 class="fw-bold mb-0 section-heading text-dark-custom">
          My <span class="text-orange">Projects</span>
        </h1>
      </div>
      <div class="row g-4">${renderProjects(projects)}</div>
    </div>
  `;

  renderFooter(data);
}

init();
