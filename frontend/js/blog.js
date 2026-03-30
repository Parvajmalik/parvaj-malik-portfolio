// blog.js — Blog listing page

import { loadData, renderHeader, renderFooter } from './main.js';
import { api } from './api.js';

function renderBlogCards(blogs) {
  if (!blogs.length) {
    return `<div class="col-12 text-center py-5 text-secondary">
              <i class="bi bi-journal-x fs-1 opacity-50 d-block mb-3"></i>
              No blog posts published yet.
            </div>`;
  }

  return blogs.map(blog => `
    <div class="col-md-4">
       <a href="blog-detail.html?slug=${blog.slug}"  class="text-decoration-none">
      <div class="card border-0 rounded-4 overflow-hidden h-100 blog-card">
        <div class="position-relative overflow-hidden">
          ${blog.featured_image
      ? `<img src="${blog.featured_image}" alt="${blog.title}" class="blog-img" />`
      : `<div class="blog-img bg-light d-flex align-items-center justify-content-center text-secondary fs-1"><i class="bi bi-image"></i></div>`}
        </div>

        <div class="card-body p-3 d-flex flex-column">
          <span class="badge rounded-pill px-3 py-2 mb-2 fw-medium blog-badge">
            ${blog.category || 'General'}
          </span>
          <div class="d-flex gap-3 mb-2 small text-secondary">
            <span><span class="text-orange">● </span>${blog.author || ''}</span>
            <span><span class="text-orange">● </span>${blog.published_at ? new Date(blog.published_at).toLocaleDateString() : ''}</span>
          </div>
          <h5 class="fw-semibold text-dark-custom mb-2 flex-grow-1" style="line-height:1.4">${blog.title}</h5>
          <p class="text-secondary small mb-0">${blog.excerpt || ''}</p>
        </div>
      </div>
      </a>
    </div>
  `).join('');
}

async function init() {
  const [data, blogs] = await Promise.all([
    loadData(),
    api.getBlogs().catch(() => []),
  ]);

  renderHeader(data);

  document.getElementById('site-main').innerHTML = `
    <div class="container py-5">
      <div class="d-flex justify-content-between align-items-center mb-5">
        <h1 class="fw-bold mb-0 section-heading text-dark-custom">
          My <span class="text-orange">Blogs</span>
        </h1>
      </div>
      <div class="row g-4">${renderBlogCards(blogs)}</div>
    </div>
  `;

  renderFooter(data);
}

init();
