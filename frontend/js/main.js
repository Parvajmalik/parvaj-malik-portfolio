// main.js — shared utilities: data loading, header & footer rendering

// ── Data ──────────────────────────────────────────────────────────────────────

export async function loadData() {
  const res = await fetch('./my-portfolio.json', { cache: 'no-cache' });
  if (!res.ok) throw new Error('Failed to load portfolio data');
  return res.json();
}

// ── Active-page detection ─────────────────────────────────────────────────────

function getActivePath() {
  const p = window.location.pathname;
  if (p.includes('blog'))    return '/blogs';   // blog.html + blog-detail.html
  if (p.includes('project')) return '/project'; // project.html + project-detail.html
  if (p.includes('contact')) return '/contact';
  return '/';
}

// Convert JSON nav path → relative .html filename
function pathToFile(path) {
  if (path === '/') return 'index.html';
  const name = path.replace(/^\//, '');   // strip leading slash
  if (name === 'blogs') return 'blog.html';
  return name + '.html';
}

// ── Header ────────────────────────────────────────────────────────────────────

export function renderHeader(data) {
  const { site, header } = data;
  const midpoint   = Math.floor(header.navLinks.length / 2);
  const activePath = getActivePath();

  const navItems = header.navLinks
    .map((link, i) => {
      const isActive  = link.path === activePath;
      const logoHtml  = i === midpoint
        ? `<div class="d-flex align-items-center justify-content-center rounded-circle fw-bold mx-3 header-logo">
             ${site.initials}
           </div>`
        : '';

      return `
        ${logoHtml}
        <a href="${pathToFile(link.path)}"
           class="text-decoration-none fw-medium px-4 py-2 rounded-pill ${isActive ? 'nav-pill-active' : 'nav-pill-inactive'}">
          ${link.label}
        </a>
      `;
    })
    .join('');

  document.getElementById('site-header').innerHTML = `
    <header class="sticky-top pt-3 px-3" style="z-index: 1000">
      <nav class="d-flex justify-content-center align-items-center rounded-pill px-4 py-2 mx-auto nav-pill-wrap justify-content-evenly">
        ${navItems}
      </nav>
    </header>
  `;
}

// ── Footer ────────────────────────────────────────────────────────────────────

export function renderFooter(data) {
  const { site, footer } = data;

  const socialLinks = footer.social
    .map(({ icon, href }) => `
      <a href="${href}" class="text-white-50 fs-5 text-decoration-none social-link">
        <i class="bi ${icon}"></i>
      </a>
    `)
    .join('');

  const navLinks = footer.navLinks
    .map(item => `
      <li>
        <a href="${item.href}" class="text-white-50 text-decoration-none footer-nav-link">${item.label}</a>
      </li>
    `)
    .join('');
    

  document.getElementById('site-footer').innerHTML = `
    <footer class="bg-dark-custom text-white">
      <div class="container py-5">

        <!-- CTA row -->
        <div class="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <h2 class="fw-semibold mb-0 cta-heading">${footer.ctaText}</h2>
          <a href="${footer.hireMeLink}"
             class="btn rounded-pill d-flex align-items-center gap-2 px-4 py-2 fw-semibold btn-orange">
            Hire me <i class="bi bi-arrow-up-right"></i>
          </a>
        </div>

        <hr class="footer-hr" />

        <!-- Main footer grid -->
        <div class="row g-5 py-4">

          <!-- Brand -->
          <div class="col-lg-4">
            <div class="d-flex align-items-center gap-2 mb-3">
              <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold footer-logo">
                ${site.initials}
              </div>
              <span class="fw-semibold fs-5">${site.name.toUpperCase()}</span>
            </div>
            <p class="text-white-50 mb-3 footer-bio">${footer.bio}</p>
            <div class="d-flex gap-3">
              ${socialLinks}
            </div>
          </div>

          <!-- Navigation -->
          <div class="col-lg-2 col-6">
            <h5 class="fw-semibold mb-3 footer-section-title">Navigation</h5>
            <ul class="list-unstyled d-flex flex-column gap-2 mb-0">
              ${navLinks}
            </ul>
          </div>

          <!-- Contact -->
          <div class="col-lg-3 col-6">
            <h5 class="fw-semibold mb-3 footer-section-title">Contact</h5>
            <ul class="list-unstyled d-flex flex-column gap-2 mb-0 text-white-50">
              <li>${footer.contact.phone}</li>
              <li>${footer.contact.email}</li>
              ${footer.contact.website ? `<li>${footer.contact.website}</li>` : ''}
            </ul>
          </div>

          <!-- Newsletter -->
          <div class="col-lg-3">
            <h5 class="fw-semibold mb-3 footer-section-title">${footer.newsletterTitle}</h5>
            <div class="input-group">
              <input
                type="email"
                class="form-control newsletter-input"
                placeholder="Email Address"
              />
              <button class="btn btn-orange border-0">
                <i class="bi bi-send-fill"></i>
              </button>
            </div>
          </div>

        </div>

        <hr class="footer-hr" />

        <p class="text-center text-white-50 mb-0 small">${site.copyright}</p>

      </div>
    </footer>
  `;
}
