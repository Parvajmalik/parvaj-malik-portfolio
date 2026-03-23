// home.js — Home page (Hero, Projects-as-About, Work Experience)

import { loadData, renderHeader, renderFooter } from './main.js';
import { api } from './api.js';

function renderBlogCards(blogs) {
  if (!blogs || !blogs.length) {
    return '<p class="text-secondary text-center col-12">No blog posts yet.</p>';
  }

  return blogs.slice(0, 3).map(blog => `
    <div class="col-md-4">
          <a href="blog-detail.html?slug=${blog.slug}" class="text-decoration-none">
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

function renderProjectCards(projects) {
  if (!projects || !projects.length) {
    return '<p class="text-white-50 text-center col-12">No projects yet.</p>';
  }

  return projects.slice(0, 3).map(p => `
    <div class="col-md-4">
      <a href="project-detail.html?slug=${p.slug}" class="text-decoration-none">
        <div class="rounded-4 p-3 h-100 position-relative about-card">
          <h3 class="text-white fw-semibold mb-3 skill-title">${p.title}</h3>
          <div class="rounded-3 overflow-hidden mb-3">
            ${p.featured_image
      ? `<img src="${p.featured_image}" alt="${p.title}" class="about-img" />`
      : `<div class="about-img d-flex align-items-center justify-content-center bg-dark text-white-50 fs-2"><i class="bi bi-image"></i></div>`}
          </div>
          <p class="text-white-50 small mb-0">${p.excerpt || ''}</p>
        </div>
      </a>
    </div>
  `).join('');
}

function renderHome(data, projects, blogs) {
  const { hero, about, workExperience } = data;

  const stars = Array.from({ length: 5 })
    .map(() => `<i class="bi bi-star-fill star-icon"></i>`)
    .join('');

  const projectCards = renderProjectCards(projects);
  const blogCards = renderBlogCards(blogs);

  const workItems = workExperience
    .map((work, index) => `
      <div class="row align-items-start g-5 mb-4">
        <div class="col-5 text-end pt-2">
          <h3 class="fw-bold mb-1 work-title text-dark-custom">${work.company}</h3>
          <p class="text-secondary mb-0 small">${work.period}</p>
        </div>
        <div class="col-2 d-flex flex-column align-items-center pt-2">
          <div class="timeline-dot ${index === 1 ? 'timeline-dot-dark' : 'timeline-dot-orange'}"></div>
          ${index < workExperience.length - 1 ? '<div class="timeline-line"></div>' : ''}
        </div>
        <div class="col-5 pt-2">
          <h3 class="fw-bold mb-1 work-title text-dark-custom">${work.position}</h3>
          <p class="text-secondary mb-0 small">${work.description}</p>
        </div>
      </div>
    `)
    .join('');

  document.getElementById('site-main').innerHTML = `
    <div>

      <!-- ── HERO ── -->
      <section class="bg-white pt-5">
        <div class="container">

          <div class="text-center mb-3">
            <span class="rounded-pill px-4 py-2 fw-medium fs-5 position-relative d-inline-block hello-badge">
              ${hero.greeting}
              <svg width="28" height="28" class="squiggle-top" viewBox="0 0 32 33" fill="none">
                <path d="M2.00055 20.0005C2.00055 17.0005 5.00055 11.0005 2.00055 2.00054M9.50055 23.5005C13.8339 19.3339 22.7005 9.20054 23.5005 2.00054M12.5005 30.5005C15.1672 30.5005 22.3005 29.1005 29.5005 23.5005"
                  stroke="#FEB273" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>

          <div class="text-center position-relative mb-5">
            <h1 class="display-3 fw-bold text-dark-custom">
              I'm <span class="text-orange">${hero.firstName}</span>,<br />
              ${hero.role}
            </h1>
            <svg width="55" height="65" class="squiggle-headline" viewBox="0 0 74 85" fill="none">
              <path d="M70.7544 35.9953C69.0721 43.6553 58.0474 57.293 60.6604 81.9553M53.5672 22.8528C40.1662 31.0616 11.8441 51.9631 5.7638 69.8985M49.8327 3.29717C43.0238 1.80175 24.0249 1.37619 2.50059 11.6372"
                stroke="#FEB273" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>

          <div class="row g-2 mt-2">
            <div class="col-lg-3 col-12 d-flex justify-content-lg-end justify-content-center">
              <div class="testimonial-wrap">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" class="mb-2">
                  <path d="M12.135 17.445H5.1C5.22 10.44 6.6 9.285 10.905 6.735C11.4 6.435 11.565 5.805 11.265 5.295C10.98 4.8 10.335 4.635 9.84 4.935C4.77 7.935 3 9.765 3 18.48V26.565C3 29.13 5.085 31.2 7.635 31.2H12.135C14.775 31.2 16.77 29.205 16.77 26.565V22.065C16.77 19.44 14.775 17.445 12.135 17.445Z" fill="#344054"/>
                  <path d="M28.365 17.445H21.33C21.45 10.44 22.83 9.285 27.135 6.735C27.63 6.435 27.795 5.805 27.495 5.295C27.195 4.8 26.565 4.635 26.055 4.935C20.985 7.935 19.215 9.765 19.215 18.495V26.58C19.215 29.145 21.3 31.215 23.85 31.215H28.35C30.99 31.215 32.985 29.22 32.985 26.58V22.08C33 19.44 31.005 17.445 28.365 17.445Z" fill="#344054"/>
                </svg>
                <p class="fw-medium mb-0 testimonial-text">${hero.testimonial}</p>
              </div>
            </div>

            <div class="col-lg-6 col-12 d-flex justify-content-center">
              <div class="hero-avatar">
                <img src="${hero.profileImage}" alt="${hero.firstName}" />
              </div>
            </div>

            <div class="col-lg-3 col-12 d-flex justify-content-lg-start justify-content-center">
              <div>
                <div class="d-flex gap-1 mb-2">${stars}</div>
                <strong class="d-block fw-bold years-count">${hero.yearsExperience} Years</strong>
                <span class="text-secondary">Experience</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ── About section ── -->
      <section id="about" class="py-5 about-section">
        <div class="container">
          <div class="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
            <div>
            <div class="d-flex justify-content-between align-items-center mb-3" >
              <h2 class="fw-bold text-white mb-1 section-heading">
                About
              </h2>
        <div class="d-flex gap-2 flex-shrink-0">
              <a href="${about.resumeUrl || '#'}" target="_blank" rel="noopener"
                 class="btn btn-orange rounded-pill px-4 py-2 fw-semibold">
                <i class="bi bi-eye me-2"></i>View Resume
              </a>
              <a href="${about.resumeUrl || '#'}" download
                 class="btn btn-outline-light rounded-pill px-3 py-2 fw-semibold">
                <i class="bi bi-download me-1"></i>Download
              </a>
            </div>
            </div>
              <p class="text-white-50 mb-0">${about.description}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- ── WORK EXPERIENCE ── -->
      <section class="py-5 bg-white">
        <div class="container work-section-wrap">
          <h2 class="fw-bold text-center mb-5 section-heading text-dark-custom">
            My <span class="text-orange">Work Experience</span>
          </h2>
          ${workItems}
        </div>
      </section>

            <!-- ── PROJECTS (was About) ── -->
      <section id="projects" class="py-5 about-section">
        <div class="container">
          <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 class="fw-bold text-white mb-1 section-heading">
                My <span class="text-orange">Projects</span>
              </h2>
            </div>
            <a href="project.html" class="btn btn-orange rounded-pill px-4 py-2 fw-semibold">
              View All <i class="bi bi-arrow-right ms-1"></i>
            </a>
          </div>
          <div class="row g-4">${projectCards}</div>
        </div>
      </section>

      <!-- ── BLOGS ── -->
      <section id="blogs" class="py-5 bg-white">
        <div class="container">
          <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h2 class="fw-bold text-dark-custom mb-1 section-heading">
                My <span class="text-orange">Blogs</span>
              </h2>
            </div>
            <a href="blog.html" class="btn btn-orange rounded-pill px-4 py-2 fw-semibold">
              View All <i class="bi bi-arrow-right ms-1"></i>
            </a>
          </div>
          <div class="row g-4">${blogCards}</div>
        </div>
      </section>
    </div>
  `;
}

async function init() {
  const [data, projects, blogs] = await Promise.all([
    loadData(),
    api.getProjects().catch(() => []),
    api.getBlogs().catch(() => []),
  ]);

  renderHeader(data);
  renderHome(data, projects, blogs);
  renderFooter(data);

  if (window.location.hash) {
    const el = document.querySelector(window.location.hash);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }
}

init();
