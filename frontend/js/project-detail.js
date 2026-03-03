// project-detail.js — Single project page

import { loadData, renderHeader, renderFooter } from './main.js';
import { api } from './api.js';

async function init() {
  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('slug');

  const data = await loadData();
  renderHeader(data);

  if (!slug) {
    document.getElementById('site-main').innerHTML = notFound();
    renderFooter(data);
    return;
  }

  try {
    const p = await api.getProject(slug);
    document.title = p.title + ' — Parvej Malik';

    const tech = Array.isArray(p.tech_stack) && p.tech_stack.length
      ? p.tech_stack.map(t => `<span class="badge bg-dark text-white">${t}</span>`).join(' ')
      : '';

    document.getElementById('site-main').innerHTML = `
      <div class="container py-5 detail-wrap">
        <a href="project.html" class="text-orange text-decoration-none mb-4 d-inline-block">
          <i class="bi bi-arrow-left me-1"></i>Back to Projects
        </a>

        ${p.featured_image
          ? `<img src="${p.featured_image}" alt="${p.title}" class="detail-hero-img rounded-4 mb-4" />`
          : ''}

        <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
          <span class="badge rounded-pill px-3 py-2 blog-badge">${p.category || 'Project'}</span>
          ${tech}
        </div>

        <h1 class="fw-bold text-dark-custom mb-3">${p.title}</h1>

        ${(p.live_url || p.github_url) ? `
          <div class="d-flex gap-3 mb-4">
            ${p.live_url   ? `<a href="${p.live_url}"   target="_blank" class="btn btn-orange rounded-pill px-4 fw-semibold"><i class="bi bi-box-arrow-up-right me-1"></i>Live Demo</a>` : ''}
            ${p.github_url ? `<a href="${p.github_url}" target="_blank" class="btn btn-outline-dark rounded-pill px-4 fw-semibold"><i class="bi bi-github me-1"></i>GitHub</a>` : ''}
          </div>` : ''}

        <div class="ck-content">${p.content || ''}</div>
      </div>
    `;
  } catch {
    document.getElementById('site-main').innerHTML = notFound();
  }

  renderFooter(data);
}

function notFound() {
  return `
    <div class="container py-5 text-center">
      <i class="bi bi-briefcase fs-1 text-secondary opacity-50 d-block mb-3"></i>
      <h2 class="text-secondary">Project not found</h2>
      <a href="project.html" class="btn btn-orange rounded-pill mt-3 px-4">Back to Projects</a>
    </div>
  `;
}

init();
