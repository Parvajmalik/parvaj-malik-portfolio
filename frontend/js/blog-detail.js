// blog-detail.js — Single blog post page

import { loadData, renderHeader, renderFooter } from './main.js';
import { api } from './api.js';

async function init() {
  const params = new URLSearchParams(window.location.search);
  const slug   = params.get('slug');

  const data = await loadData();
  renderHeader(data);

  if (!slug) {
    document.getElementById('site-main').innerHTML = notFound('blog.html', 'Back to Blogs');
    renderFooter(data);
    return;
  }

  try {
    const blog = await api.getBlog(slug);
    document.title = blog.title + ' — Parvej Malik';

    document.getElementById('site-main').innerHTML = `
      <div class="container py-5 detail-wrap">
        <a href="blog.html" class="text-orange text-decoration-none mb-4 d-inline-block">
          <i class="bi bi-arrow-left me-1"></i>Back to Blogs
        </a>

        ${blog.featured_image
          ? `<img src="${blog.featured_image}" alt="${blog.title}" class="detail-hero-img rounded-4 mb-4" />`
          : ''}

        <div class="d-flex flex-wrap gap-2 align-items-center mb-3">
          <span class="badge rounded-pill px-3 py-2 blog-badge">${blog.category || 'General'}</span>
          <span class="text-secondary small"><span class="text-orange">●</span> ${blog.author || ''}</span>
          <span class="text-secondary small"><span class="text-orange">●</span> ${blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
        </div>

        <h1 class="fw-bold text-dark-custom mb-4">${blog.title}</h1>
        <div class="ck-content">${blog.content || ''}</div>
      </div>
    `;
  } catch {
    document.getElementById('site-main').innerHTML = notFound('blog.html', 'Back to Blogs');
  }

  renderFooter(data);
}

function notFound(backHref, backLabel) {
  return `
    <div class="container py-5 text-center">
      <i class="bi bi-journal-x fs-1 text-secondary opacity-50 d-block mb-3"></i>
      <h2 class="text-secondary">Post not found</h2>
      <a href="${backHref}" class="btn btn-orange rounded-pill mt-3 px-4">${backLabel}</a>
    </div>
  `;
}

init();
