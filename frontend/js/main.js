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
  if (p.includes('blog')) return '/blogs';   // blog.html + blog-detail.html
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
  const midpoint = Math.floor(header.navLinks.length / 2);
  const activePath = getActivePath();

  const navItems = header.navLinks
    .map((link, i) => {
      const isActive = link.path === activePath;
      const logoHtml = i === midpoint
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

  // Mobile: simple link list
  const mobileNavItems = header.navLinks
    .map(link => {
      const isActive = link.path === activePath;
      return `
        <li class="nav-item">
          <a href="${pathToFile(link.path)}"
             class="nav-link fw-medium py-2 ${isActive ? 'text-orange' : 'text-white-50'}">
            ${link.label}
          </a>
        </li>
      `;
    })
    .join('');

  document.getElementById('site-header').innerHTML = `
    <header class="sticky-top pt-3 px-3" style="z-index: 1000">
      <!-- Desktop / Tablet pill nav (md+) -->
      <nav class="d-none d-md-flex justify-content-center align-items-center rounded-pill px-4 py-2 mx-auto nav-pill-wrap justify-content-evenly">
        ${navItems}
      </nav>
      <!-- Mobile nav (< md) -->
      <nav class="d-md-none navbar rounded-3 px-3 nav-pill-wrap">
        <a class="navbar-brand fw-bold text-white text-decoration-none" href="index.html">${site.name.split(' ')[0].toUpperCase()}</a>
        <button class="navbar-toggler border-0 p-1" type="button"
                data-bs-toggle="collapse" data-bs-target="#mobileNav"
                aria-controls="mobileNav" aria-expanded="false" aria-label="Toggle navigation">
          <i class="bi bi-list text-white fs-4"></i>
        </button>
        <div class="collapse navbar-collapse" id="mobileNav">
          <ul class="navbar-nav pb-2">
            ${mobileNavItems}
          </ul>
        </div>
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

        <!-- Main footer grid -->
        <div class="row g-4 g-lg-5 py-4">

          <!-- Brand -->
          <div class="col-lg-4 col-md-5">
            <div class="d-flex align-items-center justify-content-between mb-3">
              <div class="d-flex align-items-center gap-2">
                <div class="rounded-circle d-flex align-items-center justify-content-center fw-bold footer-logo">
                  ${site.initials}
                </div>
                <span class="fw-semibold fs-5">${site.name.toUpperCase()}</span>
              </div>
              <a href="${footer.hireMeLink}"
                 class="btn btn-orange rounded-pill px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2 d-md-none">
                Hire Me <i class="bi bi-arrow-up-right"></i>
              </a>
            </div>
            <p class="text-white-50 mb-3 footer-bio">${footer.bio}</p>
            <div class="d-flex gap-3">
              ${socialLinks}
            </div>
          </div>

          <!-- Navigation -->
          <div class="col-lg-2 col-md-2 order-2 order-md-0">
            <h5 class="fw-semibold mb-3 footer-section-title">Navigation</h5>
            <ul class="list-unstyled d-flex flex-column gap-2 mb-0">
              ${navLinks}
            </ul>
          </div>

          <!-- Contact -->
          <div class="col-lg-2 col-md-2 order-1 order-md-0">
            <h5 class="fw-semibold mb-3 footer-section-title">Contact</h5>
            <ul class="list-unstyled d-flex flex-column gap-2 mb-0 text-white-50">
              <li>${footer.contact.phone}</li>
              <li>${footer.contact.email}</li>
              ${footer.contact.website ? `<li>${footer.contact.website}</li>` : ''}
            </ul>
          </div>

          <!-- Hire Me (tablet/desktop only — mobile version is inside brand row) -->
          <div class="col-lg-3 col-md-3 d-none d-md-flex justify-content-end order-3 order-md-0">
            <a href="${footer.hireMeLink}"
               class="btn btn-orange rounded-pill px-4 py-2 fw-semibold d-inline-flex align-items-center gap-2 align-self-start">
              Hire Me <i class="bi bi-arrow-up-right"></i>
            </a>
          </div>

        </div>

        <hr class="footer-hr" />

        <p class="text-center text-white-50 mb-0 small">${site.copyright}</p>

      </div>
    </footer>
  `;
}
